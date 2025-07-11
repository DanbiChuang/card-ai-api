import axios from 'axios';

// 根據環境選擇 API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// 添加日誌來監測環境變量
console.log('=== API Configuration Debug ===');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_URL:', API_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('================================');

const api = axios.create({ 
  baseURL: API_URL,
  timeout: 30000 // 30秒超時
});

export default api;