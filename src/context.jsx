import React, { createContext, useState, useEffect } from 'react';

export const AppCtx = createContext();

export function Provider({ children }) {
  const [accessToken, setAccessToken] = useState('');
  const [cardData, setCardData] = useState(null);
  const [myRole, setMyRole] = useState('');
  const [savedRoles, setSavedRoles] = useState([
    '台灣新創 BD',
    '軟體工程師', 
    '產品經理',
    '行銷專員',
    '業務代表',
    '投資人',
    '顧問'
  ]);
  const [userProfile, setUserProfile] = useState(null);
  const [letter, setLetter] = useState('');

  // 從 localStorage 恢復 accessToken
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  // 保存 accessToken 到 localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  const addRole = (newRole) => {
    if (!savedRoles.includes(newRole)) {
      setSavedRoles(prev => [...prev, newRole]);
    }
  };

  const resetAll = () => {
    setCardData(null);
    setMyRole('');
    setUserProfile(null);
    setLetter('');
  };

  const value = {
    accessToken,
    setAccessToken,
    cardData,
    setCardData,
    myRole,
    setMyRole,
    savedRoles,
    addRole,
    userProfile,
    setUserProfile,
    letter,
    setLetter,
    resetAll
  };

  return (
    <AppCtx.Provider value={value}>
      {children}
    </AppCtx.Provider>
  );
} 