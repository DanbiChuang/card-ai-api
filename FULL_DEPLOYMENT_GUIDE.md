# 完整部署指南 - 前端(Vercel) + 後端(Railway)

## 部署順序

### 第一步：部署後端到 Railway

1. **準備後端專案**
   ```bash
   cd /path/to/your/api
   npm install
   ```

2. **部署到 Railway**
   - 使用 Railway CLI 或 Dashboard
   - 參考 `RAILWAY_DEPLOYMENT.md`

3. **設置環境變數**
   在 Railway Dashboard 中設置：
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   VISION_API_KEY=your_google_vision_api_key_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NODE_ENV=production
   ```

4. **獲取後端URL**
   部署完成後，記下Railway提供的URL：
   ```
   https://your-app-name.railway.app
   ```

### 第二步：部署前端到 Vercel

1. **準備前端專案**
   ```bash
   cd card-ai-frontend
   npm install
   npm run build
   ```

2. **部署到 Vercel**
   - 使用 Vercel CLI 或 Dashboard
   - 參考 `card-ai-frontend/DEPLOYMENT.md`

3. **設置前端環境變數**
   在 Vercel Dashboard 中設置：
   ```
   VITE_API_URL=https://your-app-name.railway.app/api
   ```
   **重要：** 將 `your-app-name.railway.app` 替換為實際的Railway URL

4. **重新部署前端**
   設置環境變數後，重新部署前端以應用新的API配置

### 第三步：驗證部署

1. **檢查後端健康狀態**
   ```
   https://your-app-name.railway.app/health
   ```
   應該返回 "OK"

2. **測試API端點**
   ```
   https://your-app-name.railway.app/api
   ```

3. **檢查前端功能**
   - 訪問前端網站
   - 測試所有功能是否正常
   - 檢查瀏覽器控制台是否有錯誤

## 環境變數對照表

### Railway (後端)
| 變數名 | 說明 | 必需 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API密鑰 | ✅ |
| `VISION_API_KEY` | Google Vision API密鑰 | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth客戶端ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth客戶端密鑰 | ✅ |
| `NODE_ENV` | 環境設置 | ❌ |
| `FRONTEND_URL` | 前端URL (CORS) | ❌ |

### Vercel (前端)
| 變數名 | 說明 | 必需 |
|--------|------|------|
| `VITE_API_URL` | 後端API地址 | ✅ |

## 常見問題

### 1. CORS錯誤
**症狀：** 瀏覽器控制台顯示CORS錯誤
**解決：**
- 確認後端CORS配置正確
- 檢查前端URL是否在允許列表中
- 在Railway中設置 `FRONTEND_URL` 環境變數

### 2. API調用失敗
**症狀：** 前端無法調用後端API
**解決：**
- 確認 `VITE_API_URL` 設置正確
- 檢查Railway服務是否正常運行
- 驗證API端點是否可訪問

### 3. 環境變數未生效
**症狀：** 前端仍使用舊的API地址
**解決：**
- 重新部署前端
- 清除瀏覽器緩存
- 檢查環境變數是否正確設置

## 監控和維護

### Railway監控
- 查看實時日誌
- 監控服務健康狀態
- 設置告警通知

### Vercel監控
- 查看部署狀態
- 監控網站性能
- 檢查錯誤日誌

## 更新流程

### 後端更新
1. 修改代碼
2. 推送到GitHub
3. Railway自動部署
4. 測試API功能

### 前端更新
1. 修改代碼
2. 推送到GitHub
3. Vercel自動部署
4. 測試網站功能

## 備份和恢復

### 環境變數備份
- 記錄所有環境變數
- 定期檢查變數是否過期
- 準備恢復方案

### 代碼備份
- 使用Git版本控制
- 定期備份重要配置
- 準備回滾方案 