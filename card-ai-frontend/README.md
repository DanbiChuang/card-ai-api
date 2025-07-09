<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Card AI Frontend

React 前端應用程式，提供卡片生成和信件撰寫的使用者介面。

## 功能

- 卡片生成介面
- 信件撰寫介面
- Google OAuth 登入
- 圖片上傳和處理
- 響應式設計

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

## 部署到 Vercel

1. 將程式碼推送到 GitHub
2. 在 Vercel 中連接 GitHub 倉庫
3. 設定環境變數：
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_REDIRECT_URI`
   - `VITE_API_URL`

## 技術棧

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios

## 環境變數

請參考 `env.example` 檔案了解所需的環境變數。
>>>>>>> e8c387e47f765d221fe3cfc6917f36e3da309df3
