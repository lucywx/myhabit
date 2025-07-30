// 测试API连接
async function testAPI() {
    console.log('🔍 开始测试API连接...');

    try {
        // 测试注册API
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser3',
                email: 'test3@example.com',
                password: '123456'
            })
        });

        console.log('📡 响应状态:', response.status);
        console.log('📡 响应头:', response.headers);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ 注册成功:', data);
        } else {
            const errorData = await response.json();
            console.log('❌ 注册失败:', errorData);
        }
    } catch (error) {
        console.error('💥 网络错误:', error);
        console.error('💥 错误详情:', error.message);
    }
}

// 在浏览器控制台中运行
// testAPI(); 