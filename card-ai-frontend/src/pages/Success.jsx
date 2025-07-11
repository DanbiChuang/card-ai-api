import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../context.jsx';

export default function Success() {
  const navigate = useNavigate();
  const { cardData, userProfile, myRole, resetAll } = React.useContext(AppCtx);

  const handleWriteAnother = () => {
    resetAll();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col py-8" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
      <div className="max-w-2xl mx-auto rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 text-blue-300">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4">信件已成功寄出！</h1>
          <p className="text-blue-100 text-lg">您的合作提案已經發送給對方</p>
        </div>

        {/* 寄出摘要 */}
        <div className="p-6 mb-8" style={{ border: '1px solid #8B8B8B', borderRadius: '0.5rem' }}>
          <h3 className="font-semibold text-blue-100 mb-4 text-lg">📧 寄出摘要</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-100">寄件人：</span>
              <span className="font-medium text-white">{userProfile?.name} ({userProfile?.company})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">收件人：</span>
              <span className="font-medium text-white">{cardData?.name} ({cardData?.company})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">您的身份：</span>
              <span className="font-medium text-white">{myRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">合作內容：</span>
              <span className="font-medium text-right max-w-xs text-white">{userProfile?.cooperationContent}</span>
            </div>
          </div>
        </div>

        {/* 下一步建議 */}
        <div className="border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-100 mb-3">💡 下一步建議</h3>
          <ul className="text-blue-100 space-y-2">
            <li>• 等待對方回覆（通常 1-3 個工作天）</li>
            <li>• 如果沒有回覆，可以考慮發送跟進信件</li>
            <li>• 保持專業和耐心的態度</li>
            <li>• 準備好詳細的合作提案內容</li>
          </ul>
        </div>

        {/* 按鈕 */}
        <div className="flex gap-4">
          <button
            onClick={handleWriteAnother}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-400 transition-colors"
          >
            再寫一封
          </button>
          <button
            onClick={() => window.close()}
            className="flex-1 border border-blue-200 text-blue-100 py-3 px-6 rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            關閉頁面
          </button>
        </div>

        {/* 小提示 */}
        <div className="mt-6 text-center text-sm text-blue-200">
          <p>您的資訊已保存，下次登入時無需重新填寫</p>
        </div>
      </div>
    </div>
  );
} 