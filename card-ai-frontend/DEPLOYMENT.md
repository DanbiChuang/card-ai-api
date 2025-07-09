# Vercel 部署指南

## 部署步驟

### 1. 準備工作
確保你的前端專案已經準備好部署：
- 所有依賴已安裝 (`npm install`)
- 構建測試通過 (`npm run build`)

### 2. 部署到 Vercel

#### 方法一：使用 Vercel CLI
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 在專案目錄下執行
cd card-ai-frontend
vercel

# 按照提示完成部署
```

#### 方法二：使用 Vercel Dashboard
1. 訪問 [vercel.com](https://vercel.com)
2. 連接你的 GitHub/GitLab/Bitbucket 帳戶
3. 選擇 `card-ai-frontend` 專案
4. 點擊 "Deploy"

### 3. 環境變數配置

在 Vercel Dashboard 中設置以下環境變數：

```
VITE_API_URL=https://your-backend-domain.com/api
```

**重要：** 將 `your-backend-domain.com` 替換為你的實際後端API地址。

### 4. 部署配置

專案已包含 `vercel.json` 配置文件，包含：
- 構建命令：`npm run build`
- 輸出目錄：`dist`
- 框架：`vite`
- SPA路由重寫規則

### 5. 驗證部署

部署完成後，檢查：
- 網站是否正常加載
- API調用是否正常工作
- 路由是否正確處理

## 注意事項

1. **API地址**：確保生產環境的API地址正確配置
2. **CORS**：後端需要允許前端域名的跨域請求
3. **環境變數**：所有以 `VITE_` 開頭的環境變數都會被包含在構建中
4. **路由**：SPA路由已配置，所有路由都會重定向到 `index.html`

## 故障排除

如果遇到問題：
1. 檢查 Vercel 部署日誌
2. 確認環境變數設置正確
3. 驗證 API 地址是否可訪問
4. 檢查瀏覽器控制台錯誤 