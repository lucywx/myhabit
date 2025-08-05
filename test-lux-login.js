const crypto = require('crypto');

// 获取lux用户的salt
async function getSalt() {
    const response = await fetch('http://localhost:5000/api/auth/get-salt/lux');
    const data = await response.json();
    return data.salt;
}

// 前端密码加密
function encryptPassword(password, salt) {
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
    return hashedPassword;
}

// 登录lux用户
async function loginLux() {
    try {
        // 1. 获取salt
        const salt = await getSalt();
        console.log('✅ 获取到salt:', salt);

        // 2. 加密密码
        const hashedPassword = encryptPassword('test123', salt);
        console.log('✅ 密码已加密');

        // 3. 登录
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'lux',
                hashedPassword: hashedPassword
            })
        });

        const loginData = await loginResponse.json();
        console.log('✅ 登录结果:', loginData);

        if (loginData.token) {
            // 4. 获取当前页面
            const pageResponse = await fetch('http://localhost:5000/api/user-progress/get-current-page', {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });

            const pageData = await pageResponse.json();
            console.log('✅ 当前页面:', pageData);

            return pageData;
        }

    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
}

// 运行测试
loginLux(); 