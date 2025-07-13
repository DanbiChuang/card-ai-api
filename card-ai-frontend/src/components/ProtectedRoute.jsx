import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../context.jsx';

export default function ProtectedRoute({ children }) {
  const { accessToken } = useContext(AppCtx);
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查是否有 accessToken
    if (!accessToken) {
      // 顯示警告訊息
      alert('請先登入Google帳號');
      // 重定向到登入頁面
      navigate('/');
    }
  }, [accessToken, navigate]);

  // 如果沒有 accessToken，不渲染子組件
  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
        <div className="bg-[#222] rounded-lg shadow-md p-6 sm:p-8 text-center max-w-sm w-full">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-400 mb-3 sm:mb-4"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">正在重定向...</h2>
          <p className="text-blue-100 text-sm sm:text-base">請先登入Google帳號</p>
        </div>
      </div>
    );
  }

  // 如果有 accessToken，渲染子組件
  return children;
} 