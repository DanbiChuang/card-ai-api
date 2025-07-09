import axios from 'axios';

// 根據環境設置API基礎URL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({ baseURL });

export default api;