console.log('>> card router loaded');

const express = require('express');
const multer  = require('multer');
const sharp   = require('sharp');
const axios   = require('axios');
const heicConvert = require('heic-convert');
const OpenAI  = require('openai');

const router  = express.Router();
const upload  = multer();                // 圖片暫存在 RAM

// 初始化 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 使用 OpenAI GPT-4o 作為 Agent 來分類名片資料
const parseCardWithAI = async (text) => {
  try {
    const prompt = `
你是一位專業的名片資料分析師，具有豐富的名片版面分析和資訊分類經驗。

請仔細分析以下名片文字內容，並將資訊準確分類到對應的欄位：

名片文字內容：
"""
${text}
"""

請將資訊分類到以下欄位：

1. **name (姓名)**: 
   - 通常是名片中最突出的個人資訊
   - 可能包含中文姓名、英文姓名或兩者
   - 通常位於名片中央或左上角

2. **company (公司名稱)**:
   - 通常是較大的字體或位於名片上方
   - 可能包含公司全名、簡稱或品牌名稱
   - 有時會包含公司標誌或特殊字體

3. **title (職稱/職位)**:
   - 常見職稱：經理、總監、副總、執行長、總經理、專員、助理、工程師、顧問等
   - 可能包含部門資訊，如「行銷部經理」
   - 有時會包含多個職稱

4. **email (電子郵件)**:
   - 必須符合標準電子郵件格式
   - 通常包含 @ 符號和域名
   - 可能包含公司域名或個人域名

5. **phone (電話號碼)**:
   - 可能包含國際碼（如 +886）
   - 可能包含分機號碼（如 ext. 123）
   - 可能包含手機號碼或辦公室電話

分析原則：
- 根據文字大小、位置和語義來判斷重要性
- 考慮名片的一般排版慣例
- 識別職稱關鍵字和公司相關詞彙
- 驗證電子郵件和電話號碼的格式正確性

請以JSON格式回傳結果，格式如下：
{
  "name": "姓名",
  "company": "公司名稱", 
  "title": "職稱",
  "email": "電子郵件",
  "phone": "電話號碼"
}

注意事項：
1. 如果某個欄位無法識別，請設為空字串 ""
2. 確保回傳的是有效的JSON格式，不要包含其他文字說明
3. 保持原始文字的大小寫和格式
4. 如果有多個可能的選項，選擇最符合邏輯的答案
`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1, // 使用較低的溫度以確保一致性
      max_tokens: 800,
      response_format: { type: "json_object" } // 強制回傳JSON格式
    });

    const response = chat.choices[0].message.content.trim();
    
    // 嘗試解析JSON回應
    try {
      const parsed = JSON.parse(response);
      
      // 驗證必要欄位
      const result = {
        name: parsed.name || '',
        company: parsed.company || '',
        title: parsed.title || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        rawText: text,
        aiProcessed: true // 標記為AI處理
      };
      
      console.log('AI分類結果:', result);
      return result;
      
    } catch (parseError) {
      console.error('AI回應JSON解析失敗:', parseError);
      console.error('AI原始回應:', response);
      
      // 如果AI回應不是有效JSON，回退到簡單的正則表達式方法
      console.log('回退到備用解析方法');
      return fallbackParseCard(text);
    }
    
  } catch (error) {
    console.error('OpenAI API 呼叫失敗:', error);
    // 如果AI服務失敗，回退到簡單的正則表達式方法
    console.log('AI服務失敗，回退到備用解析方法');
    return fallbackParseCard(text);
  }
};

// 回退的簡單解析方法（保留原有邏輯作為備用）
const fallbackParseCard = (text) => {
  const email = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0] || '';
  const phone = text.match(/(\+?\d[\d\s-]{7,}\d)/)?.[0] || '';
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);

  const company = lines[0] || '';
  const name    = lines[1] || '';
  const title   = lines[2] || '';

  return { company, name, title, email, phone, rawText: text };
};

// 處理 HEIC 格式的圖片
const processHeicImage = async (buffer) => {
  try {
    const jpegBuffer = await heicConvert({
      buffer: buffer,
      format: 'JPEG',
      quality: 0.8
    });
    return jpegBuffer;
  } catch (error) {
    console.error('HEIC 轉換失敗:', error);
    throw new Error('HEIC 格式處理失敗');
  }
};

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file');

  try {
    let imageBuffer = req.file.buffer;
    const fileName = req.file.originalname.toLowerCase();
    const mimeType = req.file.mimetype.toLowerCase();

    // 檢查是否為 HEIC 格式
    if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || 
        mimeType === 'image/heic' || mimeType === 'image/heif') {
      console.log('檢測到 HEIC 格式，正在轉換...');
      imageBuffer = await processHeicImage(req.file.buffer);
    }

    // 1. 壓縮圖片
    const buf = await sharp(imageBuffer)
                   .resize({ width: 1280, withoutEnlargement: true })
                   .jpeg({ quality: 80 })
                   .toBuffer();

    // 2. 檢查大小
    if (buf.length > 600_000) {
      return res.status(413).json({ err: 'File too large after compress' });
    }

    // 3. 呼叫 Google Vision OCR
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
    
    // 4. 使用 AI Agent 進行智能分類
    const parsed = await parseCardWithAI(text);
    
    return res.json(parsed); 

  } catch (err) {
    // 新增這一行，把整包回傳 JSON 印出來
    console.error('Vision response:', err.response?.data || err.message);
    
    if (err.message === 'HEIC 格式處理失敗') {
      return res.status(400).json({ err: 'HEIC 格式處理失敗，請嘗試其他格式' });
    }
    
    return res.status(500).json({ err: 'OCR failed' });
  }
  
});

console.log('>> /upload route registered');

module.exports = router;
