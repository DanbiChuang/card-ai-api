import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../context.jsx';

export default function CardReview() {
  const navigate = useNavigate();
  const { cardData, setCardData } = React.useContext(AppCtx);
  const [editedData, setEditedData] = useState(cardData || {});
  const [loading, setLoading] = useState(false);

  // 如果沒有名片資料，回到上傳頁面
  if (!cardData) {
    navigate('/upload');
    return null;
  }

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    setLoading(true);
    // 更新名片資料
    setCardData(editedData);
    // 跳轉到身份選擇頁面
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">確認名片資訊</h1>
          <p className="text-blue-100 text-sm sm:text-base">請檢查並修正 AI 解讀的名片資訊</p>
          
          {/* AI處理狀態指示器 */}
          {cardData.aiProcessed && (
            <div className="mt-3 inline-flex items-center px-2 sm:px-3 py-1" style={{ background: '#8B8B8B', color: 'white', borderRadius: '9999px', fontSize: '0.75rem sm:text-sm' }}>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              AI智能分類
            </div>
          )}
          {!cardData.aiProcessed && cardData.rawText && (
            <div className="mt-3 inline-flex items-center px-2 sm:px-3 py-1" style={{ background: '#8B8B8B', color: 'white', borderRadius: '9999px', fontSize: '0.75rem sm:text-sm' }}>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              備用規則分類
            </div>
          )}
        </div>

        {/* 步驟導覽 - 改善手機版顯示 */}
        <div className="flex flex-wrap items-center justify-center mb-6 sm:mb-8 gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="bg-[#8B8B8B] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">✓</div>
            <div className="text-[#8B8B8B] font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">上傳名片</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5" style={{ background: '#8B8B8B' }}></div>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">2</div>
            <div className="text-blue-600 font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">確認資訊</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">選擇身份</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">4</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">生成信件</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">5</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">寄出</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* 名片圖片 */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">名片圖片</h3>
            <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
              <img
                src={cardData.imageUrl || (cardData.file ? URL.createObjectURL(cardData.file) : '')}
                alt="名片"
                className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
                onError={(e) => {
                  console.error('圖片載入失敗:', e);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center text-blue-200 text-sm">
                <p>圖片載入失敗</p>
                <p className="text-xs">檔案格式可能不支援</p>
              </div>
            </div>
            

          </div>

          {/* 編輯區域 */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">名片資訊</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={editedData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="請輸入姓名"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-1">
                  公司 *
                </label>
                <input
                  type="text"
                  value={editedData.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="請輸入公司名稱"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-1">
                  職稱
                </label>
                <input
                  type="text"
                  value={editedData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="請輸入職稱"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-1">
                  電子郵件 *
                </label>
                <input
                  type="email"
                  value={editedData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="請輸入電子郵件"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-1">
                  電話
                </label>
                <input
                  type="tel"
                  value={editedData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="請輸入電話號碼"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-center space-y-reverse sm:space-y-0 space-y-3 sm:space-x-4">
          <button
            onClick={() => navigate('/upload')}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-blue-200 text-blue-100 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base"
          >
            重新上傳
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !editedData.name || !editedData.company || !editedData.email}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              !editedData.name || !editedData.company || !editedData.email || loading
                ? 'bg-blue-900 text-blue-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-400'
            }`}
          >
            {loading ? '處理中...' : '確認並繼續'}
          </button>
        </div>
      </div>
    </div>
  );
} 