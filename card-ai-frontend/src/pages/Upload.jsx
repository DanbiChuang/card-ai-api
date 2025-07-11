// src/pages/Upload.jsx
import React, { useState, useRef } from 'react';
import api from '../api.js';
import { AppCtx } from '../context.jsx';
import { useNavigate } from 'react-router-dom';
import AIFeatures from '../components/AIFeatures.jsx';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const { setCardData } = React.useContext(AppCtx);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 支援的圖片格式
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];

  // 轉換HEIC檔案為JPEG
  const convertHeicToJpeg = async (file) => {
    try {
      // 動態導入heic2any庫
      const heic2any = (await import('heic2any')).default;
      
      const blob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      
      // 創建新的File物件
      const convertedFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
        type: 'image/jpeg'
      });
      
      return convertedFile;
    } catch (error) {
      console.error('HEIC轉換失敗:', error);
      throw new Error('HEIC檔案轉換失敗');
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('請先選擇名片照片');
    
    setLoading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      // 顯示AI處理狀態
      console.log('正在使用AI智能分析名片...');
      const { data } = await api.post('/upload', form);
      // data = { company, name, title, email, phone, rawText, aiProcessed }
      
      // 檢查是否為AI處理
      const isAIProcessed = data.aiProcessed;
      console.log('AI處理狀態:', isAIProcessed ? 'AI智能分類' : '備用規則分類');
      
      setCardData({ ...data, file: file });
      navigate('/card-review');
    } catch (e) {
      console.error('Upload error:', e);
      alert('上傳失敗: ' + (e.response?.data?.err || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        alert('檔案大小不能超過 10MB');
        return;
      }
      
      // 檢查檔案格式
      const fileType = selectedFile.type.toLowerCase();
      const fileName = selectedFile.name.toLowerCase();
      
      try {
        let processedFile = selectedFile;
        
        // 處理 HEIC/HEIF 格式
        if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || 
            fileType === 'image/heic' || fileType === 'image/heif') {
          console.log('檢測到HEIC檔案，正在轉換...');
          processedFile = await convertHeicToJpeg(selectedFile);
        } else if (!supportedFormats.includes(fileType)) {
          alert('不支援的檔案格式。請使用 JPG、PNG、HEIC、HEIF 或 WebP 格式');
          return;
        }
        
        setFile(processedFile);
        // 創建預覽URL
        const url = URL.createObjectURL(processedFile);
        setPreviewUrl(url);
        
      } catch (error) {
        console.error('檔案處理失敗:', error);
        alert('檔案處理失敗: ' + error.message);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // 使用後置鏡頭
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('無法開啟相機:', error);
      alert('無法開啟相機，請檢查權限設定或使用檔案上傳功能');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // 設定 canvas 尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 繪製影片幀到 canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 將 canvas 轉換為 blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `名片照片_${new Date().getTime()}.jpg`, {
          type: 'image/jpeg'
        });
        setFile(file);
        // 創建預覽URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col w-full" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen w-full">
        <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Shot2<i style={{ fontStyle: 'italic', color: 'white' }}>M<span style={{ color: '#117CFF' }}>a</span><span style={{ color: '#117CFF' }}>i</span>l</i></h1>
          <p className="text-blue-100 text-base sm:text-lg">拍攝或上傳名片照片，AI 幫你生成合作提案</p>
        </div>

        {/* 步驟導覽 - 改善手機版顯示 */}
        <div className="flex flex-wrap items-center justify-center mb-6 sm:mb-8 gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">1</div>
            <div className="text-blue-600 font-medium ml-1 sm:ml-2 text-blue-100 text-xs sm:text-sm">上傳名片</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">2</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">確認資訊</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">選擇身份</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">4</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">生成信件</div>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
          <div className="flex items-center">
            <div className="bg-gray-300 text-gray-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">5</div>
            <div className="text-gray-500 font-medium ml-1 sm:ml-2 text-blue-200 text-xs sm:text-sm">寄出</div>
          </div>
        </div>



        {/* 相機拍攝模式 */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex-1 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* 拍攝指引框 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-white border-dashed rounded-lg w-80 h-48 opacity-50"></div>
              </div>
              
              {/* 關閉按鈕 */}
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            {/* 拍攝按鈕 */}
            <div className="bg-black p-4 flex justify-center">
              <button
                onClick={capturePhoto}
                className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
              >
                <div className="bg-white rounded-full w-12 h-12 border-4 border-gray-300"></div>
              </button>
            </div>
          </div>
        )}

        {/* 上傳區域 */}
        <div className="border-2 border-dashed border-gray-300 p-4 sm:p-6 lg:p-8 text-center mb-6 sm:mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          
          {file ? (
            <div>
              <img
                src={previewUrl}
                alt="名片預覽"
                className="mx-auto max-w-full max-h-32 sm:max-h-48 rounded-lg shadow-sm"
              />
              <p className="mt-2 text-xs sm:text-sm text-blue-100 break-words">{file.name}</p>
              <button
                onClick={() => {
                  setFile(null);
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }
                }}
                className="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-800"
              >
                重新選擇
              </button>
            </div>
          ) : (
            <div>
              {/* 操作按鈕 */}
              <div className="flex justify-center">
                <button
                  onClick={handleUploadClick}
                  disabled={loading}
                  className="py-2 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 text-sm sm:text-base"
                >
                  📁 上傳名片照
                </button>
              </div>
              
              <p className="text-xs sm:text-sm text-blue-100 mt-2 sm:mt-3 px-2">
                支援 JPG、PNG、HEIC、HEIF、WebP 格式
              </p>
            </div>
          )}
        </div>
        {/* AI功能說明 */}
        <div>
          <AIFeatures />
        </div>

        {/* 上傳按鈕 */}
        <div className="space-y-4 sm:space-y-6">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              !file || loading
                ? 'bg-blue-900 text-blue-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-400'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs sm:text-sm">AI智能分析中...</span>
              </div>
            ) : (
              '開始分析名片'
            )}
          </button>
          
          {loading && (
            <div className="text-center text-xs sm:text-sm text-blue-200 px-2">
              <p>正在使用AI智能分析名片內容...</p>
              <p className="text-xs mt-1">這可能需要幾秒鐘時間</p>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-4 sm:mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
            <p className="text-xs sm:text-sm text-blue-200 mt-2">正在進行 OCR 辨識...</p>
          </div>
        )}
      </div>
    </div>
  );
}
