const fetch = require('node-fetch');

async function testFrontendTransfer() {
  console.log('🧪 测试前端转账记录显示...\n');
  
  // 1. 检查前端服务器是否运行
  console.log('1. 检查前端服务器:');
  try {
    const frontendResponse = await fetch('http://localhost:3000');
    console.log('   前端服务器状态:', frontendResponse.status);
  } catch (error) {
    console.log('   ❌ 前端服务器未运行，请启动: npm start (在client目录)');
    return;
  }
  console.log('');
  
  // 2. 检查后端服务器
  console.log('2. 检查后端服务器:');
  try {
    const backendResponse = await fetch('http://localhost:5000/api/mock-payment/transfers');
    console.log('   后端服务器状态:', backendResponse.status);
  } catch (error) {
    console.log('   ❌ 后端服务器未运行');
    return;
  }
  console.log('');
  
  // 3. 测试建议
  console.log('3. 测试步骤:');
  console.log('   1. 确保前端和后端服务器都在运行');
  console.log('   2. 访问 http://localhost:3000');
  console.log('   3. 登录用户lux');
  console.log('   4. 进入转账记录页面');
  console.log('   5. 应该能看到2条转账记录:');
  console.log('      - 平台转账: $100 (成功)');
  console.log('      - 朋友转账: $50 (成功)');
  console.log('');
  
  console.log('4. 如果仍然看不到记录，请检查:');
  console.log('   - 浏览器控制台是否有错误');
  console.log('   - 网络请求是否成功');
  console.log('   - localStorage中是否有有效的token');
  console.log('');
  
  console.log('✅ 测试完成');
}

testFrontendTransfer(); 