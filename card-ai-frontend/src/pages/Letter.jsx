import React, { useContext, useEffect, useState } from 'react';
import { AppCtx } from '../context.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Letter() {
  const { cardData, myRole, userProfile, letter, setLetter, accessToken, setAccessToken, profileVersion } = useContext(AppCtx);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [subject, setSubject] = useState('');
  const [shouldRegenerate, setShouldRegenerate] = useState(false); // 追蹤是否需要重新生成
  const navigate = useNavigate();

  // 如果沒有必要資料，回到上傳頁
  useEffect(() => {
    if (!cardData || !myRole || !userProfile) {
      navigate('/upload');
    }
  }, [cardData, myRole, userProfile, navigate]);

  if (!cardData || !myRole || !userProfile) {
    return null;
  }

  // 生成主旨的函數
  const generateSubject = (cooperationContent) => {
    if (!cooperationContent) return '合作提案';
    
    if (cooperationContent.includes('SaaS') || cooperationContent.includes('串接')) {
      return 'SaaS 串接合作提案';
    } else if (cooperationContent.includes('技術') || cooperationContent.includes('技術交流')) {
      return '技術交流合作提案';
    } else if (cooperationContent.includes('業務') || cooperationContent.includes('業務合作')) {
      return '業務合作提案';
    } else if (cooperationContent.includes('投資') || cooperationContent.includes('投資機會')) {
      return '投資合作提案';
    } else if (cooperationContent.includes('行銷') || cooperationContent.includes('行銷合作')) {
      return '行銷合作提案';
    } else if (cooperationContent.includes('產品') || cooperationContent.includes('產品合作')) {
      return '產品合作提案';
    } else {
      // 如果沒有特定關鍵字，使用合作內容的前20個字作為主旨
      const shortContent = cooperationContent.length > 20 
        ? cooperationContent.substring(0, 20) + '...' 
        : cooperationContent;
      return `${shortContent}合作提案`;
    }
  };

  // 自動生成信件和主旨
  useEffect(() => {
    // 檢查是否有 Profile 資料
    if (userProfile && myRole) {
      // 如果沒有信件，首次生成
      if (!letter && cardData && myRole) {
        generateLetter();
      }
      
      // 生成主旨
      if (!subject && userProfile?.cooperationContent) {
        setSubject(generateSubject(userProfile.cooperationContent));
      }
    }
  }, [cardData, myRole, userProfile]);

  // 當 Profile 版本變化時，重新生成
  useEffect(() => {
    if (profileVersion > 0 && cardData && myRole) {
      setLetter('');
      setSubject('');
      setShouldRegenerate(true);
    }
  }, [profileVersion]);

  // 當需要重新生成時，執行生成
  useEffect(() => {
    if (shouldRegenerate && cardData && myRole) {
      generateLetter();
      // 重新生成主旨
      if (userProfile?.cooperationContent) {
        setSubject(generateSubject(userProfile.cooperationContent));
      }
      setShouldRegenerate(false);
    }
  }, [shouldRegenerate, cardData, myRole]);

  const generateLetter = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/generate', {
        myRole,
        parsed: cardData,
        companyInfo: { name: cardData.company },
        userInfo: {
          name: userProfile.name,
          company: userProfile.company,
          title: userProfile.title,
          phone: userProfile.phone,
          cooperationContent: userProfile.cooperationContent
        }
      });
      setLetter(data.letter);
    } catch (error) {
      console.error('Generate error:', error);
      alert('生成信件失敗: ' + (error.response?.data?.err || error.message));
    } finally {
      setLoading(false);
    }
  };

  const regenerateLetter = async () => {
    setRegenerating(true);
    try {
      const { data } = await api.post('/generate', {
        myRole,
        parsed: cardData,
        companyInfo: { name: cardData.company },
        userInfo: {
          name: userProfile.name,
          company: userProfile.company,
          title: userProfile.title,
          phone: userProfile.phone,
          cooperationContent: userProfile.cooperationContent
        }
      });
      setLetter(data.letter);
    } catch (error) {
      console.error('Regenerate error:', error);
      alert('重新生成失敗: ' + (error.response?.data?.err || error.message));
    } finally {
      setRegenerating(false);
    }
  };

  const handleSend = async () => {
    if (!cardData.email) {
      alert('收件人 Email 未辨識，無法寄送。請返回上一步確認名片資訊。');
      navigate('/profile');
      return;
    }

    setSending(true);
    try {
      await api.post('/send', {
        access_token: accessToken,
        toEmail: cardData.email,
        subject: subject || '合作提案',
        body: letter
      });
      // 跳轉到成功頁面
      navigate('/success');
    } catch (error) {
      console.error('Send error:', error);
      
      // 檢查是否為認證錯誤 (401)
      if (error.response?.status === 401) {
        // Token 過期或無效，清除舊的 token 並重新認證
        setAccessToken('');
        localStorage.removeItem('accessToken');
        
        alert('您的登入已過期，請重新登入 Google 帳號。');
        
        // 觸發 Google OAuth
        const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        u.searchParams.set('response_type', 'token');
        u.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
        u.searchParams.set('redirect_uri', import.meta.env.VITE_GOOGLE_REDIRECT_URI);
        u.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.send');
        window.location.href = u.toString();
        return;
      }
      
      alert('寄送失敗: ' + (error.response?.data?.err || error.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">生成合作提案信</h1>
          <p className="text-blue-100 text-sm sm:text-base">AI 已為您生成合作提案，您可以編輯後寄出</p>
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
          <div className="w-4 sm:w-8 h-0.5" style={{ background: '#8B8B8B' }}></div>
          <div className="flex items-center">
            <div className="bg-[#8B8B8B] text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">✓</div>
            <div className="text-[#8B8B8B] font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">選擇身份</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-blue-600 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">4</div>
            <div className="text-blue-600 font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">生成信件</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">5</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">寄出</div>
          </div>
        </div>

        {/* 信件資訊 */}
        <div className="p-3 sm:p-4 mb-4 sm:mb-6" style={{ border: '1px solid #4F4F4F', borderRadius: '0.5rem' }}>
          <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">📧 信件資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <h4 className="font-medium text-blue-100 mb-1 sm:mb-2 text-xs sm:text-sm">寄件人</h4>
              <div className="space-y-0.5 sm:space-y-1">
                <div><span className="text-blue-100">姓名：</span><span className="font-medium text-white">{userProfile.name}</span></div>
                <div><span className="text-blue-100">公司：</span><span className="font-medium text-white">{userProfile.company}</span></div>
                <div><span className="text-blue-100">身份：</span><span className="font-medium text-white">{myRole}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-100 mb-1 sm:mb-2 text-xs sm:text-sm">收件人</h4>
              <div className="space-y-0.5 sm:space-y-1">
                <div><span className="text-blue-100">姓名：</span><span className="font-medium text-white">{cardData.name || '未辨識'}</span></div>
                <div><span className="text-blue-100">公司：</span><span className="font-medium text-white">{cardData.company || '未辨識'}</span></div>
                <div><span className="text-blue-100">Email：</span><span className="font-medium text-white">{cardData.email || '未辨識'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 主旨編輯 */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-blue-100 mb-1 sm:mb-2">
            主旨 *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="請輸入信件主旨"
            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* 信件編輯區域 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <label className="block text-xs sm:text-sm font-medium text-blue-100">
              合作提案信內容
            </label>
            <button
              onClick={regenerateLetter}
              disabled={regenerating}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              {regenerating ? '重新生成中...' : '🔄 重新生成'}
            </button>
          </div>
          {loading ? (
            <div className="border border-gray-300 rounded-lg p-6 sm:p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
              <p className="text-blue-100 text-sm sm:text-base">AI 正在生成合作提案信...</p>
            </div>
          ) : (
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              placeholder="AI 正在生成信件內容..."
              rows="12"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm sm:text-base"
            />
          )}
        </div>

        {/* AI建議 */}
        <div className="p-3 sm:p-4 mb-4 sm:mb-6" style={{ border: '1px solid #4F4F4F', borderRadius: '0.5rem' }}>
          <div className="flex items-start">
            <div className="text-[#8B8B8B] mr-2 sm:mr-3 text-sm sm:text-base">🤖</div>
            <div>
              <p className="font-medium text-xs sm:text-sm" style={{ color: '#8B8B8B' }}>AI 建議</p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#8B8B8B' }}>
                這封信已經針對 {cardData.company} 和您的 {myRole} 角色進行了優化。
                您可以自由編輯內容，或點擊「重新生成」讓 AI 調整語氣和重點。
              </p>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 py-2 sm:py-3 px-3 sm:px-4 border border-blue-200 text-blue-100 rounded-lg hover:bg-blue-900 transition-colors text-sm sm:text-base"
          >
            返回身份設定
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !cardData.email}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              !cardData.email || sending
                ? 'bg-blue-900 text-blue-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-400'
            }`}
          >
            {sending ? '寄送中...' : '寄出信件'}
          </button>
        </div>
      </div>
    </div>
  );
}
