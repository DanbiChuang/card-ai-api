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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">處理 Google 登入</h2>
        <p className="text-gray-600">正在完成授權流程...</p>
      </div>
    </div>
  );
}