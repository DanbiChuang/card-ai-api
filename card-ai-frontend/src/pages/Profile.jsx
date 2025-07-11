// src/pages/Profile.jsx
import React, { useState } from 'react';
import { AppCtx } from '../context.jsx';
import { useNavigate } from 'react-router-dom';

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
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">選擇身份</h1>
          <p className="text-blue-100">請填寫您的資訊並選擇合作方向</p>
        </div>

        {/* 步驟導覽 */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className="bg-[#8B8B8B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
            <div className="text-[#8B8B8B] font-medium ml-2 text-blue-100">上傳名片</div>
          </div>
          <div className="w-8 h-0.5" style={{ background: '#8B8B8B' }}></div>
          <div className="flex items-center">
            <div className="bg-[#8B8B8B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
            <div className="text-[#8B8B8B] font-medium ml-2 text-blue-100">確認資訊</div>
          </div>
          <div className="w-8 h-0.5 bg-blue-600 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            <div className="text-blue-600 font-medium ml-2 text-blue-100">選擇身份</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
            <div className="text-gray-500 font-medium ml-2 text-blue-200">生成信件</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
            <div className="text-gray-500 font-medium ml-2 text-blue-200">寄出</div>
          </div>
        </div>

        {/* 使用者資訊填寫 */}
        <div className="border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-white mb-3">👤 您的資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-blue-100">姓名 *</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1"
                placeholder="請輸入您的姓名"
              />
            </div>
            <div>
              <label className="text-sm text-blue-100">公司 *</label>
              <input
                type="text"
                value={userInfo.company}
                onChange={e => setUserInfo({ ...userInfo, company: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1"
                placeholder="請輸入您的公司"
              />
            </div>
            <div>
              <label className="text-sm text-blue-100">職稱</label>
              <input
                type="text"
                value={userInfo.title}
                onChange={e => setUserInfo({ ...userInfo, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1"
                placeholder="請輸入您的職稱"
              />
            </div>
            <div>
              <label className="text-sm text-blue-100">電話</label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1"
                placeholder="請輸入您的電話"
              />
            </div>
          </div>
        </div>

        {/* 角色選擇 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-blue-100 mb-2">
            您的角色 / 合作方向
          </label>
          
          {/* 常用角色選項 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {savedRoles.map((savedRole) => (
              <button
                key={savedRole}
                onClick={() => setRole(savedRole)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
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
              className="px-3 py-1 rounded-full text-sm border border-dashed border-gray-400 text-blue-50 hover:border-blue-400 hover:text-blue-600"
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
            className="w-full border border-blue-200 rounded-lg px-3 py-2 text-white bg-[#222] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 合作方向 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-blue-100 mb-2">
            尋求合作內容 *
          </label>
          <textarea
            value={cooperationDirection}
            onChange={(e) => setCooperationDirection(e.target.value)}
            placeholder="例如：想談 SaaS 串接合作、技術交流、業務合作、投資機會..."
            rows="3"
            className="w-full border border-blue-200 rounded-lg px-3 py-2 text-white bg-[#222] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/card-review')}
            className="flex-1 py-3 px-4 border border-blue-200 text-blue-100 rounded-lg hover:bg-blue-900 transition-colors"
          >
            返回確認名片
          </button>
          <button
            onClick={handleNext}
            disabled={!role || !userInfo.name || !userInfo.company || !cooperationDirection}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
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
