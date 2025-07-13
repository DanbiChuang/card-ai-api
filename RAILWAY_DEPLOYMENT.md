# Railway 後端部署指南

## 部署步驟

### 1. 準備工作
確保你的後端專案已經準備好部署：
- 所有依賴已安裝 (`npm install`)
- 環境變數已配置
- 健康檢查端點正常 (`/health`)

### 2. 部署到 Railway

#### 方法一：使用 Railway CLI
```bash
# 安裝 Railway CLI
npm install -g @railway/cli

# 登入 Railway
railway login

# 在專案目錄下執行
railway init

# 部署
railway up
```

#### 方法二：使用 Railway Dashboard
1. 訪問 [railway.app](https://railway.app)
2. 連接你的 GitHub/GitLab 帳戶
3. 創建新專案
4. 選擇 "Deploy from GitHub repo"
5. 選擇你的後端專案
6. 點擊 "Deploy"

### 3. 環境變數配置

在 Railway Dashboard 中設置以下環境變數：

#### 必需變數：
```
OPENAI_API_KEY=your_openai_api_key_here
VISION_API_KEY=your_google_vision_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### 可選變數：
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 4. 部署配置

專案已包含 `railway.json` 配置文件，包含：
- 構建器：NIXPACKS
- 副本數：1
- 重啟策略：失敗時重啟
- 健康檢查路徑：`/health`

### 5. 獲取部署URL

部署完成後，Railway會提供一個URL，格式類似：
```
https://your-app-name.railway.app
```

### 6. 更新前端配置

獲取Railway部署URL後，需要更新前端的API配置：

1. 在 Vercel Dashboard 中設置環境變數：
```
VITE_API_URL=https://your-app-name.railway.app/api
```

2. 重新部署前端

### 7. 驗證部署

部署完成後，檢查：
- 健康檢查端點：`https://your-app-name.railway.app/health`
- API端點是否正常響應
- CORS配置是否正確
- 前端是否能正常調用API

## 注意事項

1. **環境變數**：確保所有API密鑰都正確設置
2. **CORS**：已配置支持Vercel域名
3. **健康檢查**：Railway會使用 `/health` 端點檢查服務狀態
4. **端口**：Railway會自動設置 `PORT` 環境變數

## 故障排除

如果遇到問題：
1. 檢查 Railway 部署日誌
2. 確認環境變數設置正確
3. 驗證健康檢查端點
4. 檢查API端點是否可訪問
5. 確認CORS配置

## 自動化部署

Railway支持自動化部署：
- 連接到GitHub後，每次push都會自動部署
- 可以設置不同的分支部署到不同的環境
- 支持預覽部署（Preview Deployments）

## 監控和日誌

- Railway提供實時日誌查看
- 可以設置告警和通知
- 支持性能監控 