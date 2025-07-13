# AI 名片分類功能說明

## 概述

本專案已升級名片分類功能，從原本的簡單規則分類法改為使用 **OpenAI GPT-4o 作為智能 Agent** 來進行名片資料分類。這個改進大幅提升了分類的準確性和靈活性。

## 主要改進

### 1. **智能分類 vs 簡單規則**

**原本的方法（簡單規則）：**
```javascript
const parseCard = (text) => {
  const email = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0] || '';
  const phone = text.match(/(\+?\d[\d\s-]{7,}\d)/)?.[0] || '';
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);

  const company = lines[0] || '';  // 固定第1行
  const name    = lines[1] || '';  // 固定第2行
  const title   = lines[2] || '';  // 固定第3行

  return { company, name, title, email, phone, rawText: text };
};
```

**新的AI方法：**
```javascript
const parseCardWithAI = async (text) => {
  // 使用 OpenAI GPT-4o 進行智能分析
  const prompt = `你是一位專業的名片資料分析師...`;
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    response_format: { type: "json_object" }
  });
  // 智能分類結果
};
```

### 2. **AI Agent 的優勢**

#### **A. 語義理解能力**
- 能夠理解不同語言的名片（中文、英文等）
- 識別職稱關鍵字（經理、總監、執行長等）
- 理解公司名稱和個人姓名的語義差異

#### **B. 靈活的版面分析**
- 不依賴固定的行序
- 能夠處理各種名片排版格式
- 識別重要資訊的位置和大小

#### **C. 智能驗證**
- 驗證電子郵件格式的正確性
- 識別電話號碼的國際碼和分機
- 處理複雜的職稱組合

### 3. **錯誤處理機制**

系統包含完整的錯誤處理機制：

```javascript
try {
  // AI 分類
  const result = await parseCardWithAI(text);
  return result;
} catch (error) {
  // 如果 AI 失敗，回退到簡單規則
  console.log('AI服務失敗，回退到備用解析方法');
  return fallbackParseCard(text);
}
```

## 技術實現

### 1. **API 整合**

```javascript
// 初始化 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 智能分類函數
const parseCardWithAI = async (text) => {
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
  `;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1, // 低溫度確保一致性
    max_tokens: 800,
    response_format: { type: "json_object" } // 強制JSON格式
  });
};
```

### 2. **測試驗證**

創建了測試檔案 `test_ai_parsing.js` 來驗證功能：

```javascript
const testCases = [
  {
    name: "標準名片格式",
    text: `台灣科技股份有限公司
張小明
行銷部經理
Email: ming@tech.com.tw
Tel: +886-2-2345-6789`
  },
  {
    name: "英文名片",
    text: `ABC International Corp.
John Smith
Senior Marketing Manager
john.smith@abc.com
+1-555-123-4567`
  }
  // ... 更多測試案例
];
```

## 使用方式

### 1. **環境設定**

確保 `.env` 檔案包含：
```
OPENAI_API_KEY=your_openai_api_key_here
VISION_API_KEY=your_google_vision_api_key_here
```

### 2. **API 端點**

POST `/api/upload` 現在會：
1. 使用 Google Vision OCR 提取文字
2. 使用 OpenAI GPT-4o 進行智能分類
3. 回傳結構化的名片資料

### 3. **回傳格式**

```json
{
  "name": "張小明",
  "company": "台灣科技股份有限公司",
  "title": "行銷部經理",
  "email": "ming@tech.com.tw",
  "phone": "+886-2-2345-6789",
  "rawText": "原始OCR文字",
  "aiProcessed": true
}
```

## 效能考量

### 1. **API 成本**
- 每次名片分類約消耗 0.001-0.003 USD
- 建議監控 API 使用量

### 2. **回應時間**
- AI 分類增加約 1-3 秒處理時間
- 包含錯誤處理和回退機制

### 3. **準確性提升**
- 大幅提升複雜名片的分類準確性
- 支援多語言和各種排版格式

## 未來改進方向

1. **快取機制**：對相似名片進行快取
2. **批量處理**：支援一次處理多張名片
3. **學習機制**：根據用戶修正反饋改進模型
4. **多模型支援**：整合其他 AI 模型作為備選

## 結論

使用 OpenAI GPT-4o 作為 Agent 進行名片分類是一個非常可行的方案，相比原本的簡單規則法有以下優勢：

✅ **更高的準確性**：能夠理解語義和上下文  
✅ **更強的靈活性**：支援各種名片格式  
✅ **更好的容錯性**：包含完整的錯誤處理機制  
✅ **更智能的分析**：能夠處理複雜的職稱和公司名稱  

這個改進讓系統能夠更準確地處理各種不同格式的名片，大幅提升了用戶體驗。 