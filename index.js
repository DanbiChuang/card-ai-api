const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const cardRouter   = require('./card');    // 名片 API
const letterRouter = require('./letter');  // 產信 API
const listEndpoints = require('express-list-endpoints');

const app = express();
app.use(cors());
app.use(express.json());

const sendRouter = require('./send');
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
