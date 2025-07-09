// src/context.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AppCtx = createContext();

export function Provider({ children }) {
  // 名片資料
  const [cardData, setCardData] = useState(null);
  
  // 使用者角色
  const [myRole, setMyRole] = useState('');
  
  // 使用者資訊
  const [userProfile, setUserProfile] = useState(null);
  
  // 生成的信件
  const [letter, setLetter] = useState('');
  
  // Google OAuth token
  const [accessToken, setAccessToken] = useState('');
  
  // 常用角色列表
  const [savedRoles, setSavedRoles] = useState([
    '台灣新創 BD',
    '軟體工程師',
    '產品經理',
    '行銷專員'
  ]);

  // 從 localStorage 恢復狀態
  useEffect(() => {
    const savedRole = localStorage.getItem('myRole');
    const savedToken = localStorage.getItem('accessToken');
    const savedRoles = localStorage.getItem('savedRoles');
    const savedUserProfile = localStorage.getItem('userProfile');
    
    if (savedRole) setMyRole(savedRole);
    if (savedToken) setAccessToken(savedToken);
    if (savedRoles) setSavedRoles(JSON.parse(savedRoles));
    if (savedUserProfile) setUserProfile(JSON.parse(savedUserProfile));
  }, []);

  // 保存狀態到 localStorage
  useEffect(() => {
    if (myRole) localStorage.setItem('myRole', myRole);
  }, [myRole]);

  useEffect(() => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
  }, [accessToken]);

  useEffect(() => {
    localStorage.setItem('savedRoles', JSON.stringify(savedRoles));
  }, [savedRoles]);

  useEffect(() => {
    if (userProfile) localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // 新增角色
  const addRole = (newRole) => {
    if (newRole && !savedRoles.includes(newRole)) {
      setSavedRoles([...savedRoles, newRole]);
    }
  };

  // 清除所有狀態（用於重新開始）
  const resetAll = () => {
    setCardData(null);
    setLetter('');
    // 保留使用者資訊和 accessToken，不清除
  };

  return (
    <AppCtx.Provider value={{ 
      cardData, 
      setCardData, 
      myRole, 
      setMyRole,
      userProfile,
      setUserProfile,
      letter,
      setLetter,
      accessToken,
      setAccessToken,
      savedRoles,
      addRole,
      resetAll
    }}>
      {children}
    </AppCtx.Provider>
  );
}
