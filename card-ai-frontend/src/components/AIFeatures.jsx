// src/components/AIFeatures.jsx
import React from 'react';

export default function AIFeatures() {
  return (
    <div className="border border-blue-200 rounded-lg p-4 mb-6" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-100">AI智能分類功能</h3>
          <div className="mt-2 text-sm text-blue-50">
            <ul className="space-y-1">
              <li>• 智能識別姓名、公司、職稱、電子郵件、電話</li>
              <li>• 支援中英文混合名片</li>
              <li>• 處理複雜職稱和公司名稱</li>
              <li>• 自動驗證電子郵件和電話格式</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 