// src/pages/Profile.jsx
import React, { useState } from 'react';
import { AppCtx } from '../context.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Profile() {
  const { 
    cardData, 
    setCardData, 
    myRole, 
    setMyRole, 
    savedRoles, 
    addRole,
    userProfile,
    setUserProfile,
    setProfileVersion
  } = React.useContext(AppCtx);
  
  const [role, setRole] = useState(myRole);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState('');
  
  // 名片上傳相關狀態
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [ocrResult, setOcrResult] = useState(null);
  
  // 使用者資訊狀態
  const [userInfo, setUserInfo] = useState({
    name: userProfile?.name || '',
    company: userProfile?.company || '',
    title: userProfile?.title || '',
    phone: userProfile?.phone || '',
    cooperationContent: userProfile?.cooperationContent || ''
  });
  
  // 合作內容狀態
  const [cooperationDirection, setCooperationDirection] = useState(userProfile?.cooperationContent || '');
  
  const navigate = useNavigate();

  // 如果沒有名片資料，回到上傳頁
  if (!cardData) {
    navigate('/upload');
    return null;
  }

  // 名片上傳區塊
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 處理名片上傳
  const handleCardUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      setUploadError('請上傳圖片檔案');
      return;
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('檔案大小不能超過 5MB');
      return;
    }

    setUploadedImage(URL.createObjectURL(file));
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/profile-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      setOcrResult(result);

      // 自動填寫表單欄位
      setUserInfo({
        name: result.name || userInfo.name,
        company: result.company || userInfo.company,
        title: result.title || userInfo.title,
        phone: result.phone || userInfo.phone,
        cooperationContent: result.cooperationContent || userInfo.cooperationContent
      });

      setCooperationDirection(result.cooperationDirection || cooperationDirection);

      // 如果有職稱，自動設定為角色
      if (result.title && !role) {
        setRole(result.title);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.err || '上傳失敗，請重試');
    } finally {
      setIsUploading(false);
    }
  };

  // 清除上傳的圖片
  const clearUploadedImage = () => {
    setUploadedImage(null);
    setOcrResult(null);
    setUploadError('');
  };

  const handleNext = () => {
    if (!role) return alert('請選擇或輸入您的角色');
    if (!userInfo.name) return alert('請填寫您的姓名');
    if (!userInfo.company) return alert('請填寫您的公司');
    
    setMyRole(role);
    setUserProfile({
      ...userInfo,
      cooperationContent: cooperationDirection
    });
    // 增加 Profile 版本，觸發 Letter 頁面重新生成
    setProfileVersion(prev => prev + 1);
    navigate('/letter');
  };

  const handleAddRole = () => {
    if (newRole.trim()) {
      addRole(newRole.trim());
      setRole(newRole.trim());
      setNewRole('');
      setShowAddRole(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">選擇身份</h1>
          <p className="text-blue-100 text-sm sm:text-base">請填寫您的資訊並選擇合作方向</p>
        </div>

        {/* 步驟導覽 - 改善手機版顯示 */}
        <div className="flex flex-wrap items-center justify-center mb-4 sm:mb-6 gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="bg-[#8B8B8B] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">✓</div>
            <div className="text-[#8B8B8B] font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">上傳名片</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5" style={{ background: '#8B8B8B' }}></div>
          <div className="flex items-center">
            <div className="bg-[#8B8B8B] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">✓</div>
            <div className="text-[#8B8B8B] font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">確認資訊</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-blue-600 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
            <div className="text-blue-600 font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">選擇身份</div>
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

        {/* 上傳您的名片（新版，參考 /upload） */}
        <div className="border-2 border-dashed border-gray-300 p-4 sm:p-6 lg:p-8 text-center mb-6 sm:mb-8">
          <h3 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">📷 上傳您自己的名片</h3>
          <p className="text-xs sm:text-sm text-blue-200 mb-3">或自行填寫下欄資訊</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleCardUpload}
            className="hidden"
            id="profile-file-upload"
            disabled={isUploading}
          />
          {uploadedImage ? (
            <div>
              <img
                src={uploadedImage}
                alt="名片預覽"
                className="mx-auto max-w-full max-h-32 sm:max-h-48 rounded-lg shadow-sm"
              />
              <button
                onClick={clearUploadedImage}
                className="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-800"
              >
                重新選擇
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center">
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="py-2 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 text-sm sm:text-base"
                >
                  📁 上傳名片照
                </button>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 sm:mt-3 px-2">
                支援 JPG、PNG、HEIC、HEIF、WebP 格式
              </p>
            </div>
          )}
          {isUploading && (
            <div className="mt-3 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-200"></div>
              <p className="text-xs sm:text-sm text-blue-200 mt-2">正在進行 OCR 辨識...</p>
            </div>
          )}
          {uploadError && (
            <div className="mt-3 p-2 bg-red-500 bg-opacity-20 border border-red-300 rounded text-red-200 text-xs">
              {uploadError}
            </div>
          )}
        </div>

        {/* 使用者資訊填寫 */}
        <div className="border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">👤 您的資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="text-xs sm:text-sm text-blue-100">姓名 *</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm sm:text-base"
                placeholder="請輸入您的姓名"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm text-blue-100">公司 *</label>
              <input
                type="text"
                value={userInfo.company}
                onChange={e => setUserInfo({ ...userInfo, company: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm sm:text-base"
                placeholder="請輸入您的公司"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm text-blue-100">職稱</label>
              <input
                type="text"
                value={userInfo.title}
                onChange={e => setUserInfo({ ...userInfo, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm sm:text-base"
                placeholder="請輸入您的職稱"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm text-blue-100">電話</label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm sm:text-base"
                placeholder="請輸入您的電話"
              />
            </div>
          </div>
        </div>

        {/* 角色選擇 */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-2">
            您的角色 / 合作方向
          </label>
          
          {/* 常用角色選項 */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
            {savedRoles.map((savedRole) => (
              <button
                key={savedRole}
                onClick={() => setRole(savedRole)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border transition-colors ${
                  role === savedRole
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                {savedRole}
              </button>
            ))}
            <button
              onClick={() => setShowAddRole(true)}
              className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-dashed border-gray-400 text-blue-50 hover:border-blue-400 hover:text-blue-600"
            >
              + 新增
            </button>
          </div>

          {/* 自訂角色輸入 */}
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="例如：台灣新創 BD、軟體工程師、產品經理..."
            className="w-full border border-blue-200 rounded-lg px-2 sm:px-3 py-2 text-white bg-[#222] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* 合作方向 */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-2">
            尋求合作內容 *
          </label>
          <textarea
            value={cooperationDirection}
            onChange={(e) => setCooperationDirection(e.target.value)}
            placeholder="例如：想談 SaaS 串接合作、技術交流、業務合作、投資機會..."
            rows="3"
            className="w-full border border-blue-200 rounded-lg px-2 sm:px-3 py-2 text-white bg-[#222] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* AI 確認泡泡 */}
        {role && userInfo.name && userInfo.company && cooperationDirection && (
          <div className="p-4 mb-6" style={{ border: '1px solid #BFDBFE', borderRadius: '0.5rem' }}>
            <div className="flex items-start">
              <div className="text-[#8B8B8B] mr-3">🤖</div>
              <div>
                <p className="text-blue-100 font-medium">AI 確認</p>
                <p className="text-blue-100 text-sm mt-1">
                  <strong>{userInfo.name}</strong> ({userInfo.company}) 將以 <strong>{role}</strong> 身分
                  發送合作提案給 <strong>{cardData.name}</strong> ({cardData.company})。
                  <br />
                  合作內容：{cooperationDirection}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 按鈕 */}
        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-center space-y-reverse sm:space-y-0 space-y-3 sm:space-x-4">
          <button
            onClick={() => navigate('/card-review')}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-blue-200 text-blue-100 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base"
          >
            返回確認名片
          </button>
          <button
            onClick={handleNext}
            disabled={!role || !userInfo.name || !userInfo.company || !cooperationDirection}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              !role || !userInfo.name || !userInfo.company || !cooperationDirection
                ? 'bg-blue-900 text-blue-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-400'
            }`}
          >
            下一步：生成合作信
          </button>
        </div>

        {/* 新增角色彈窗 */}
        {showAddRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">新增常用角色</h3>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="輸入角色名稱"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddRole(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAddRole}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  新增
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
