// test_profile_upload.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testProfileUpload() {
  try {
    // 創建一個測試用的 FormData
    const FormData = require('form-data');
    const formData = new FormData();
    
    // 使用一個測試圖片（如果存在的話）
    const testImagePath = path.join(__dirname, 'test_card.jpg');
    
    if (fs.existsSync(testImagePath)) {
      formData.append('file', fs.createReadStream(testImagePath));
    } else {
      console.log('測試圖片不存在，創建一個簡單的測試...');
      // 創建一個簡單的測試圖片
      const testImageBuffer = Buffer.from('fake image data');
      formData.append('file', testImageBuffer, {
        filename: 'test_card.jpg',
        contentType: 'image/jpeg'
      });
    }

    console.log('Testing profile-upload endpoint...');
    
    const response = await axios.post('http://localhost:4000/api/profile-upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000
    });

    console.log('✅ Profile upload endpoint working!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Profile upload test failed:');
    console.error('Error:', error.response?.data || error.message);
  }
}

testProfileUpload(); 