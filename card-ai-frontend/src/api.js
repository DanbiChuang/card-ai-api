import axios from 'axios';

// 根據環境選擇 API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({ 
  baseURL: API_URL,
  timeout: 30000 // 30秒超時
});

export default api;