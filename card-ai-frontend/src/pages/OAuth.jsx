import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppCtx } from '../context.jsx';

export default function OAuth() {
  const { setAccessToken } = useContext(AppCtx);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 從 URL hash 中提取 access token
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      alert('Google 登入失敗: ' + error);
      navigate('/upload');
      return;
    }

    if (accessToken) {
      // 保存 access token
      setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      
      // 顯示成功訊息
      alert('Google 登入成功！現在可以開始使用了。');
      
      // 跳轉到上傳頁面
      navigate('/upload');
    } else {
      // 沒有 token，可能是直接訪問此頁面
      navigate('/');
    }
  }, [location, navigate, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
      <div className="bg-[#222] rounded-lg shadow-md p-6 sm:p-8 text-center max-w-sm w-full">
        <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-400 mb-3 sm:mb-4"></div>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">處理 Google 登入</h2>
        <p className="text-blue-100 text-sm sm:text-base">正在完成授權流程...</p>
      </div>
    </div>
  );
}