# 環境設置指南

## 本地開發設置

### 1. 創建環境變數文件
在專案根目錄創建 `.env` 文件：

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Google Vision API Key
VISION_API_KEY=your_google_vision_api_key_here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 啟動後端服務
```bash
npm start
```

### 4. 啟動前端服務
```bash
cd card-ai-frontend
npm install
npm run dev
```

## 生產環境設置

### Railway 部署
1. 在 Railway Dashboard 中設置環境變數
2. 參考 `RAILWAY_DEPLOYMENT.md`

### Vercel 部署
1. 在 Vercel Dashboard 中設置環境變數
2. 參考 `card-ai-frontend/DEPLOYMENT.md`

## 環境變數說明

### 必需變數
- `OPENAI_API_KEY`: OpenAI API密鑰
- `VISION_API_KEY`: Google Vision API密鑰
- `GOOGLE_CLIENT_ID`: Google OAuth客戶端ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth客戶端密鑰

### 可選變數
- `PORT`: 服務器端口 (默認: 4000)
- `NODE_ENV`: 環境設置 (development/production)
- `FRONTEND_URL`: 前端URL (用於CORS)

## 注意事項

1. **安全**: 不要將 `.env` 文件提交到版本控制
2. **備份**: 妥善保管所有API密鑰
3. **測試**: 部署前先在本地測試所有功能 