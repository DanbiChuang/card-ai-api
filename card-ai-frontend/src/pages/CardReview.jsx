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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">確認名片資訊</h1>
          <p className="text-gray-600">請檢查並修正 AI 解析的名片資訊</p>
        </div>

        {/* 步驟導覽 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
            <div className="text-green-600 font-medium ml-2">上傳名片</div>
          </div>
          <div className="w-8 h-0.5 bg-green-600 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
            <div className="text-blue-600 font-medium ml-2">確認資訊</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            <div className="text-gray-500 font-medium ml-2">選擇身份</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
            <div className="text-gray-500 font-medium ml-2">生成信件</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
            <div className="text-gray-500 font-medium ml-2">寄出</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 名片圖片 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">名片圖片</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
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
              <div className="hidden text-center text-gray-500">
                <p>圖片載入失敗</p>
                <p className="text-sm">檔案格式可能不支援</p>
              </div>
            </div>
          </div>

          {/* 編輯區域 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">名片資訊</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={editedData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公司 *
                </label>
                <input
                  type="text"
                  value={editedData.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入公司名稱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  職稱
                </label>
                <input
                  type="text"
                  value={editedData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入職稱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電子郵件 *
                </label>
                <input
                  type="email"
                  value={editedData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入電子郵件"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話
                </label>
                <input
                  type="tel"
                  value={editedData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入電話號碼"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重新上傳
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !editedData.name || !editedData.company || !editedData.email}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !editedData.name || !editedData.company || !editedData.email || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? '處理中...' : '確認並繼續'}
          </button>
        </div>
      </div>
    </div>
  );
} 