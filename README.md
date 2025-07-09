# Card AI API

後端 API 服務，提供卡片生成和信件撰寫功能。

## 功能

- 卡片生成 API
- 信件撰寫 API
- Google OAuth 整合
- 圖片處理和轉換

## 本地開發

1. 安裝依賴：
```bash
npm install
```

2. 複製環境變數檔案：
```bash
cp env.example .env
```

3. 設定環境變數（在 .env 檔案中）

4. 啟動開發伺服器：
```bash
npm run dev
```

## 部署到 Railway

1. 將程式碼推送到 GitHub
2. 在 Railway 中連接 GitHub 倉庫
3. 設定環境變數：
   - `OPENAI_API_KEY`
   - `VISION_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `PORT` (Railway 會自動設定)

## API 端點

- `POST /api/card` - 生成卡片
- `POST /api/letter` - 撰寫信件
- `GET /api/oauth2callback` - Google OAuth 回調

## 環境變數

請參考 `env.example` 檔案了解所需的環境變數。 