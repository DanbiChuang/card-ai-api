// letter.js
globalThis.fetch = (...a) => import('node-fetch').then(({default: f}) => f(...a));

const express = require('express');
const OpenAI  = require('openai');            // ← 注意：CommonJS 要這樣寫，不要解構
const openai  = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const router = express.Router();

/**
 * POST /api/generate
 * body = { myRole, parsed, companyInfo, userInfo }
 */
router.post('/generate', async (req, res) => {
  try {
    const { myRole, parsed = {}, companyInfo = {}, userInfo = {} } = req.body;

    // 預防前端漏欄位
    if (!myRole || !parsed.name || !parsed.company || !userInfo.name || !userInfo.company) {
      return res.status(400).json({ err: 'Missing fields' });
    }

    /* --------- GPT Prompt --------- */
    const prompt = `
你是 ${userInfo.name}，來自「${userInfo.company}」，擔任 ${userInfo.title || '（未填寫職稱）'}，身份是 ${myRole}。

你希望和「${parsed.company}」的 ${parsed.name}（${parsed.title || '（未辨識職稱）'}）展開合作。

合作內容：${userInfo.cooperationContent}

收件人資訊：
姓名：${parsed.name}
職稱：${parsed.title || '（未辨識）'}
公司：${parsed.company}
Email：${parsed.email || '（未辨識）'}
電話：${parsed.phone || '（未辨識）'}

寄件人資訊：
姓名：${userInfo.name}
公司：${userInfo.company}
職稱：${userInfo.title || '（未填寫）'}
電話：${userInfo.phone || '（未填寫）'}

公司背景：
${companyInfo.description || '（查無資料，請用公開資訊推敲）'}

請用 **繁體中文** 撰寫一封專業、誠懇且具體的合作提案信。

**重要要求：**
1. 只寫信件的內文內容，不要包含主旨、寄件人資訊、收件人資訊等
2. 直接從問候語開始，例如：「您好」、「敬啟者」等
3. 內容要針對「${userInfo.cooperationContent}」這個具體合作方向
4. 段落結構清晰，突出雙方合作價值
5. 最後提出可行的下一步
6. 結尾要包含寄件人的聯絡方式（姓名、公司、職稱、電話）

**範例格式：**
您好，

[信件內容...]

[結尾和聯絡方式]

此致
${userInfo.name}
${userInfo.company}
${userInfo.title || ''}
電話：${userInfo.phone || ''}
`;
    /* --------- GPT Call --------- */
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',          // 若帳戶還沒開，改用 gpt-3.5-turbo
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    return res.json({ letter: chat.choices[0].message.content.trim() });
  } catch (err) {
    console.error('OpenAI error:', err.response?.data || err.message);
    return res.status(500).json({ err: 'Generate failed' });
  }
});

module.exports = router;
