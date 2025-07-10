// test_ai_parsing.js
// 測試AI名片分類功能

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 測試用的名片文字樣本
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
  },
  {
    name: "複雜職稱",
    text: `創新數位科技有限公司
李美玲
資深產品經理 / 技術顧問
meiling.li@innovate.com
02-8765-4321 ext. 123`
  },
  {
    name: "簡短格式",
    text: `王大明
總經理
daming@company.com
0912-345-678`
  }
];

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
      temperature: 0.1,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const response = chat.choices[0].message.content.trim();
    
    try {
      const parsed = JSON.parse(response);
      return {
        name: parsed.name || '',
        company: parsed.company || '',
        title: parsed.title || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        rawText: text,
        aiProcessed: true
      };
    } catch (parseError) {
      console.error('JSON解析失敗:', parseError);
      return null;
    }
    
  } catch (error) {
    console.error('OpenAI API 呼叫失敗:', error);
    return null;
  }
};

// 執行測試
const runTests = async () => {
  console.log('開始測試AI名片分類功能...\n');
  
  for (const testCase of testCases) {
    console.log(`=== 測試案例: ${testCase.name} ===`);
    console.log('原始文字:');
    console.log(testCase.text);
    console.log('\nAI分類結果:');
    
    const result = await parseCardWithAI(testCase.text);
    
    if (result) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('分類失敗');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 避免API限制，加入延遲
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('測試完成！');
};

// 如果直接執行此檔案
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { parseCardWithAI, testCases }; 