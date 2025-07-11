import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../context.jsx';

export default function Landing() {
  const navigate = useNavigate();
  const { accessToken } = React.useContext(AppCtx);

  const handleLogin = () => {
    if (accessToken) {
      navigate('/upload');
    } else {
      const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      u.searchParams.set('response_type', 'token');
      u.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');
      u.searchParams.set('redirect_uri', import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/oauth2callback`);
      u.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.send');
      window.location.href = u.toString();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: `radial-gradient(ellipse 120% 90% at 30% 25%, #005EFF 40%, #003080 70%, transparent 100%), linear-gradient(120deg, #005EFF 0%, #003080 60%, #000018 100%)`,
      }}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-white text-6xl mb-6 tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span style={{ fontWeight: 600, fontStyle: 'normal' }}>Shot2</span>
          <span style={{ fontWeight: 600, fontStyle: 'italic' }}>Mail</span>
        </h1>
        <p
          className="text-white text-xl mb-12"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          Snap a Card. Seal the Deal.
        </p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 border border-white text-white rounded-[20px] text-lg transition-colors"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
        >
          Login & Start
        </button>
      </div>
    </div>
  );
} 