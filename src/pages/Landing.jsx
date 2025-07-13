import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../context.jsx';

export default function Landing() {
  const navigate = useNavigate();
  const { accessToken } = React.useContext(AppCtx);

  const handleLogin = () => {
    // 如果已經登入，直接跳轉到上傳頁面
    if (accessToken) {
      navigate('/upload');
    } else {
      // 重定向到 Google OAuth
      const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      u.searchParams.set('response_type', 'token');
      u.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');
      u.searchParams.set('redirect_uri', import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/oauth2callback`);
      u.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.send');
      window.location.href = u.toString();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景圖片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 250\'%3E%3Crect width=\'400\' height=\'250\' fill=\'%23f8f9fa\'/%3E%3Crect x=\'50\' y=\'30\' width=\'300\' height=\'180\' fill=\'%23ffffff\' stroke=\'%23e9ecef\' stroke-width=\'2\' rx=\'8\'/%3E%3Crect x=\'70\' y=\'60\' width=\'120\' height=\'8\' fill=\'%23333\' rx=\'4\'/%3E%3Crect x=\'70\' y=\'80\' width=\'80\' height=\'6\' fill=\'%23666\' rx=\'3\'/%3E%3Crect x=\'70\' y=\'100\' width=\'100\' height=\'6\' fill=\'%23666\' rx=\'3\'/%3E%3Crect x=\'70\' y=\'120\' width=\'90\' height=\'6\' fill=\'%23666\' rx=\'3\'/%3E%3Crect x=\'70\' y=\'140\' width=\'110\' height=\'6\' fill=\'%23666\' rx=\'3\'/%3E%3Crect x=\'70\' y=\'160\' width=\'70\' height=\'6\' fill=\'%23666\' rx=\'3\'/%3E%3C/svg%3E")',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* 內容層 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white px-6">
          <h1 className="text-6xl font-bold mb-6 tracking-wide">
            Shot2Mail
          </h1>
          <p className="text-xl mb-8 text-gray-200 max-w-md mx-auto">
            拍下名片，AI 幫你生成專業的合作提案信件
          </p>
          <button
            onClick={handleLogin}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            {accessToken ? '開始使用' : '登入即開始'}
          </button>
        </div>
      </div>
    </div>
  );
} 