const fetch = require('node-fetch');

async function testBankInfo() {
  try {
    const testData = {
      bankName: '中国工商银行',
      accountName: 'Test User',
      accountNumber: '4242424242424242',
      cardType: 'Visa',
      expiryDate: '12/25',
      cvv: '123',
      branchName: ''
    };

    console.log('发送的测试数据:', testData);

    const response = await fetch('http://localhost:5000/api/bank-info/set-bank-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', data);

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testBankInfo(); 