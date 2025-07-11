import React, { useState } from 'react';

export default function TestHeic() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setLoading(true);
      try {
        const fileName = selectedFile.name.toLowerCase();
        
        if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
          console.log('檢測到HEIC檔案，正在轉換...');
          const convertedFile = await convertHeicToJpeg(selectedFile);
          setFile(convertedFile);
          const url = URL.createObjectURL(convertedFile);
          setPreviewUrl(url);
        } else {
          setFile(selectedFile);
          const url = URL.createObjectURL(selectedFile);
          setPreviewUrl(url);
        }
      } catch (error) {
        console.error('檔案處理失敗:', error);
        alert('檔案處理失敗: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-8" style={{ background: "linear-gradient(to bottom, #4F4F4F 0%, #000000 100%)" }}>
      <div className="max-w-md mx-auto bg-[#222] rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-white mb-4">HEIC 轉換測試</h1>
        
        <input
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="mb-4"
        />
        
        {loading && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <p className="text-sm text-blue-100 mt-2">正在轉換檔案...</p>
          </div>
        )}
        
        {file && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">檔案資訊:</h3>
            <p className="text-blue-100">檔名: {file.name}</p>
            <p className="text-blue-100">類型: {file.type}</p>
            <p className="text-blue-100">大小: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            {previewUrl && (
              <div>
                <h3 className="text-lg font-semibold text-white">預覽:</h3>
                <img
                  src={previewUrl}
                  alt="預覽"
                  className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 