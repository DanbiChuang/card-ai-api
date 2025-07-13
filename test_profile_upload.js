// test_profile_upload.js
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testProfileUpload() {
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png'
    });

    console.log('Testing profile-upload endpoint...');
    
    const response = await axios.post('http://localhost:4000/api/profile-upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 10000
    });

    console.log('✅ Profile upload endpoint working!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Profile upload test failed:');
    console.error('Error:', error.response?.data || error.message);
  }
}

testProfileUpload(); 