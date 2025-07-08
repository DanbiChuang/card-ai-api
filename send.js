// api/send.js
const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

function encodeRFC2047(str) {
  return `=?utf-8?B?${Buffer.from(str, 'utf8').toString('base64')}?=`;
}

function buildRawMail({ to, from, subject, body }) {
  const lines = [];
  lines.push(`To: ${to}`);
  if (from) lines.push(`From: ${from}`);
  lines.push(`Subject: ${encodeRFC2047(subject)}`);
  lines.push('MIME-Version: 1.0');
  lines.push('Content-Type: text/plain; charset="UTF-8"');
  lines.push('Content-Transfer-Encoding: 8bit');
  lines.push('');
  lines.push(body);
  return Buffer.from(lines.join('\r\n'), 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_'); // Gmail 需要 URL-safe base64
}

router.post('/send', async (req, res) => {
  try {
    const { access_token, toEmail, subject, body } = req.body;
    if (!access_token || !toEmail || !body)
      return res.status(400).json({ err: 'Missing fields' });

    const oauth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth.setCredentials({ access_token });
    const gmail = google.gmail({ version: 'v1', auth: oauth });

    const rawMsg = buildRawMail({
      to: toEmail,
      subject: subject || '合作提案',
      body
    });
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: rawMsg }
    });

    res.json({ status: 'sent' });
  } catch (e) {
    console.error('Gmail send error:', e.errors || e);
    
    // 檢查是否為認證錯誤
    if (e.code === 401 || e.status === 401 || (e.errors && e.errors[0]?.code === 401)) {
      return res.status(401).json({ err: 'Authentication failed - token expired or invalid' });
    }
    
    res.status(500).json({ err: 'Send failed' });
  }
});

module.exports = router;
