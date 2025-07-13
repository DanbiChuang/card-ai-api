// src/utils/aiParsingDemo.js
// 前端AI分類演示數據

export const demoCardData = {
  // 標準中文名片
  standardChinese: {
    name: "張小明",
    company: "台灣科技股份有限公司",
    title: "行銷部經理",
    email: "ming@tech.com.tw",
    phone: "+886-2-2345-6789",
    rawText: "台灣科技股份有限公司\n張小明\n行銷部經理\nEmail: ming@tech.com.tw\nTel: +886-2-2345-6789",
    aiProcessed: true
  },
  
  // 英文名片
  englishCard: {
    name: "John Smith",
    company: "ABC International Corp.",
    title: "Senior Marketing Manager",
    email: "john.smith@abc.com",
    phone: "+1-555-123-4567",
    rawText: "ABC International Corp.\nJohn Smith\nSenior Marketing Manager\njohn.smith@abc.com\n+1-555-123-4567",
    aiProcessed: true
  },
  
  // 複雜職稱名片
  complexTitle: {
    name: "李美玲",
    company: "創新數位科技有限公司",
    title: "資深產品經理 / 技術顧問",
    email: "meiling.li@innovate.com",
    phone: "02-8765-4321 ext. 123",
    rawText: "創新數位科技有限公司\n李美玲\n資深產品經理 / 技術顧問\nmeiling.li@innovate.com\n02-8765-4321 ext. 123",
    aiProcessed: true
  },
  
  // 多語言混合名片
  multilingual: {
    name: "陳美玲 / Mary Chen",
    company: "Global Tech Solutions Ltd.",
    title: "Senior Product Manager",
    email: "mary.chen@globaltech.com",
    phone: "+886-912-345-678",
    rawText: "Global Tech Solutions Ltd.\n陳美玲 / Mary Chen\nSenior Product Manager\nmary.chen@globaltech.com\n+886-912-345-678",
    aiProcessed: true
  },
  
  // 備用規則分類結果
  fallbackResult: {
    name: "王大明",
    company: "",
    title: "總經理",
    email: "daming@company.com",
    phone: "0912-345-678",
    rawText: "王大明\n總經理\ndaming@company.com\n0912-345-678",
    aiProcessed: false
  }
};

// 模擬AI分類過程
export const simulateAIParsing = async (rawText) => {
  // 模擬API延遲
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 根據原始文字模擬AI分類結果
  const lines = rawText.split(/\n+/).map(l => l.trim()).filter(Boolean);
  
  const result = {
    name: "",
    company: "",
    title: "",
    email: "",
    phone: "",
    rawText: rawText,
    aiProcessed: true
  };
  
  // 模擬AI分析邏輯
  for (const line of lines) {
    const emailMatch = line.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    if (emailMatch) {
      result.email = emailMatch[0];
      continue;
    }
    
    const phoneMatch = line.match(/(\+?\d[\d\s-]{7,}\d)/);
    if (phoneMatch) {
      result.phone = phoneMatch[0];
      continue;
    }
    
    const titleKeywords = ['經理', '總監', '副總', '執行長', '總經理', '專員', '助理', '工程師', '顧問', 'Manager', 'Director', 'CEO', 'CTO', 'VP'];
    const hasTitleKeyword = titleKeywords.some(keyword => line.includes(keyword));
    
    const companyKeywords = ['股份有限公司', '有限公司', 'Corp.', 'Inc.', 'Ltd.', 'Company', 'Co.'];
    const hasCompanyKeyword = companyKeywords.some(keyword => line.includes(keyword));
    
    if (hasTitleKeyword) {
      result.title = line;
    } else if (hasCompanyKeyword) {
      result.company = line;
    } else if (line.length <= 10 && !result.name) {
      result.name = line;
    } else if (!result.company) {
      result.company = line;
    } else if (!result.name) {
      result.name = line;
    }
  }
  
  return result;
};

// 獲取演示數據
export const getDemoData = (type) => {
  return demoCardData[type] || demoCardData.standardChinese;
}; 