const fetch = require('node-fetch');

async function testBankAPI() {
  console.log('🧪 测试银行信息API...\n');
  
  const baseURL = 'http://localhost:5000';
  
  // 1. 测试无token访问
  console.log('1. 测试无token访问:');
  try {
    const response = await fetch(`${baseURL}/api/bank-info/get-bank-info`);
    const data = await response.text();
    console.log('   状态码:', response.status);
    console.log('   响应:', data);
  } catch (error) {
    console.log('   错误:', error.message);
  }
  console.log('');
  
  // 2. 测试服务器连接
  console.log('2. 测试服务器连接:');
  try {
    const response = await fetch(`${baseURL}/api/auth/test`);
    console.log('   状态码:', response.status);
    console.log('   响应:', response.statusText);
  } catch (error) {
    console.log('   错误:', error.message);
  }
  console.log('');
  
  // 3. 测试CORS
  console.log('3. 测试CORS配置:');
  try {
    const response = await fetch(`${baseURL}/api/bank-info/get-bank-info`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization'
      }
    });
    console.log('   CORS状态码:', response.status);
    console.log('   CORS头:', response.headers.get('access-control-allow-origin'));
  } catch (error) {
    console.log('   CORS错误:', error.message);
  }
  console.log('');
  
  console.log('✅ API测试完成');
}

testBankAPI(); 