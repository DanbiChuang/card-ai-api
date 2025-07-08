console.log('>> card router loaded');

const express = require('express');
const multer  = require('multer');
const sharp   = require('sharp');
const axios   = require('axios');

const router  = express.Router();
const upload  = multer();                // 圖片暫存在 RAM

const parseCard = (text) => {
  const email = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0] || '';
  const phone = text.match(/(\+?\d[\d\s-]{7,}\d)/)?.[0] || '';
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);

  const company = lines[0] || '';
  const name    = lines[1] || '';
  const title   = lines[2] || '';

  return { company, name, title, email, phone, rawText: text };
};

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file');

  // 1. 壓縮圖片
  const buf = await sharp(req.file.buffer)
                 .resize({ width: 1280, withoutEnlargement: true })
                 .jpeg({ quality: 80 })
                 .toBuffer();

  // 2. 檢查大小
  if (buf.length > 600_000) {
    return res.status(413).json({ err: 'File too large after compress' });
  }

  // 3. 呼叫 Google Vision OCR
  try {
    const visionResp = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`,
      {
        requests: [{
          image: { content: buf.toString('base64') },
          features: [{ type: 'TEXT_DETECTION' }]
        }]
      }
    );

    const text = visionResp.data.responses?.[0]?.fullTextAnnotation?.text || '';
    const parsed = parseCard(text);          // 抽欄位
    return res.json(parsed); 

  } catch (err) {
    // 新增這一行，把整包回傳 JSON 印出來
    console.error('Vision response:', err.response?.data || err.message);
    return res.status(500).json({ err: 'OCR failed' });
  }
  
});


console.log('>> /upload route registered');

module.exports = router;
