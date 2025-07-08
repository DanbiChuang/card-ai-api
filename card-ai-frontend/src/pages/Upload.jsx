// src/pages/Upload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { AppCtx } from '../context.jsx';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setCardData } = React.useContext(AppCtx);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert('請先選擇名片照片');
    
    setLoading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const { data } = await axios.post('http://localhost:4000/api/upload', form);
      // data = { company, name, title, email, phone, rawText }
      setCardData({ ...data, file: file });
      navigate('/card-review');
    } catch (e) {
      console.error('Upload error:', e);
      alert('上傳失敗: ' + (e.response?.data?.err || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
        alert('檔案大小不能超過 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Shot2Mail</h1>
          <p className="text-gray-600">上傳名片照片，AI 幫你生成合作提案</p>
        </div>

        {/* 步驟導覽 */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
            <div className="text-blue-600 font-medium ml-2">上傳名片</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
            <div className="text-gray-500 font-medium ml-2">確認資訊</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            <div className="text-gray-500 font-medium ml-2">選擇身份</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
            <div className="text-gray-500 font-medium ml-2">生成信件</div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
            <div className="text-gray-500 font-medium ml-2">寄出</div>
          </div>
        </div>

        {/* 上傳區域 */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            {file ? (
              <div>
                <img
                  src={URL.createObjectURL(file)}
                  alt="名片預覽"
                  className="mx-auto max-w-full max-h-48 rounded-lg shadow-sm"
                />
                <p className="mt-2 text-sm text-gray-600">{file.name}</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-600">點擊選擇名片照片</p>
                <p className="text-sm text-gray-500 mt-1">支援 JPG、PNG 格式</p>
              </div>
            )}
          </label>
        </div>

        <button
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !file || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? '處理中...' : '開始解析名片'}
        </button>

        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-2">正在進行 OCR 辨識...</p>
          </div>
        )}
      </div>
    </div>
  );
}
