const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const cardRouter   = require('./card.cjs');    // 名片 API
const letterRouter = require('./letter.cjs');  // 產信 API
const listEndpoints = require('express-list-endpoints');

const app = express();

// CORS配置 - 支持前端域名
const corsOptions = {
  origin: function (origin, callback) {
    // 允許的域名列表
    const allowedOrigins = [
      'http://localhost:5173', // 開發環境
      'http://localhost:3000', // 備用開發端口
      'https://card-ai-frontend.vercel.app', // Vercel部署
      'https://*.vercel.app', // 所有Vercel子域名
      process.env.FRONTEND_URL // 環境變數中的前端URL
    ].filter(Boolean); // 過濾掉undefined值
    
    // 允許沒有origin的請求（如移動端應用）
    if (!origin) return callback(null, true);
    
    // 檢查是否在允許列表中
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // 支持通配符匹配
        const pattern = allowedOrigin.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const sendRouter = require('./send.cjs');
app.use('/api', sendRouter);     // POST /api/send

// 基本路由
app.get('/health', (_, res) => res.send('OK'));

// 掛子路由（只掛一次）
console.log('準備掛 router');
app.use('/api', cardRouter);
app.use('/api', letterRouter);   // POST /api/generate
console.log('router 已掛到 /api');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('API on', PORT);
  console.table(listEndpoints(app));   // 列出所有已掛路由
});
