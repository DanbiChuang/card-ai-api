// test_ai_parsing_mock.js
// 模擬測試AI名片分類功能（不依賴實際API）

// 模擬的AI分類函數
const mockParseCardWithAI = async (text) => {
  // 模擬AI分析邏輯
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  
  // 模擬AI的智能分析結果
  const mockAIResponse = {
    "name": "",
    "company": "",
    "title": "",
    "email": "",
    "phone": ""
  };
  
  // 模擬AI的語義分析邏輯
  for (const line of lines) {
    // 識別電子郵件
    const emailMatch = line.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    if (emailMatch) {
      mockAIResponse.email = emailMatch[0];
      continue;
    }
    
    // 識別電話號碼
    const phoneMatch = line.match(/(\+?\d[\d\s-]{7,}\d)/);
    if (phoneMatch) {
      mockAIResponse.phone = phoneMatch[0];
      continue;
    }
    
    // 識別職稱關鍵字
    const titleKeywords = ['經理', '總監', '副總', '執行長', '總經理', '專員', '助理', '工程師', '顧問', 'Manager', 'Director', 'CEO', 'CTO', 'VP'];
    const hasTitleKeyword = titleKeywords.some(keyword => line.includes(keyword));
    
    // 識別公司關鍵字
    const companyKeywords = ['股份有限公司', '有限公司', 'Corp.', 'Inc.', 'Ltd.', 'Company', 'Co.'];
    const hasCompanyKeyword = companyKeywords.some(keyword => line.includes(keyword));
    
    // 根據語義和位置分配欄位
    if (hasTitleKeyword) {
      mockAIResponse.title = line;
    } else if (hasCompanyKeyword) {
      mockAIResponse.company = line;
    } else if (line.length <= 10 && !mockAIResponse.name) {
      // 短名稱可能是姓名
      mockAIResponse.name = line;
    } else if (!mockAIResponse.company) {
      // 如果還沒分配公司，可能是公司名稱
      mockAIResponse.company = line;
    } else if (!mockAIResponse.name) {
      // 如果還沒分配姓名，可能是姓名
      mockAIResponse.name = line;
    }
  }
  
  return {
    ...mockAIResponse,
    rawText: text,
    aiProcessed: true
  };
};

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
  },
  {
    name: "多語言混合",
    text: `Global Tech Solutions Ltd.
陳美玲 / Mary Chen
Senior Product Manager
mary.chen@globaltech.com
+886-912-345-678`
  }
];

// 執行測試
const runTests = async () => {
  console.log('開始測試AI名片分類功能（模擬版本）...\n');
  
  for (const testCase of testCases) {
    console.log(`=== 測試案例: ${testCase.name} ===`);
    console.log('原始文字:');
    console.log(testCase.text);
    console.log('\nAI分類結果:');
    
    const result = await mockParseCardWithAI(testCase.text);
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n' + '='.repeat(50) + '\n');
  }
  
  console.log('測試完成！');
  console.log('\n=== 與原本規則法的比較 ===');
  console.log('原本規則法：');
  console.log('- 固定行序：第1行=公司，第2行=姓名，第3行=職稱');
  console.log('- 只使用正則表達式識別email和phone');
  console.log('- 無法處理複雜的版面或多語言');
  
  console.log('\nAI分類法：');
  console.log('- 語義理解：能識別職稱關鍵字和公司關鍵字');
  console.log('- 靈活分析：不依賴固定行序');
  console.log('- 智能驗證：驗證email和phone格式');
  console.log('- 多語言支援：支援中英文混合名片');
  console.log('- 錯誤處理：包含回退機制');
};

// 如果直接執行此檔案
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { mockParseCardWithAI, testCases }; 