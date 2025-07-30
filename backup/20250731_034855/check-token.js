// 在浏览器控制台中运行这个脚本
const token = localStorage.getItem('token');
console.log('当前token:', token);

if (token) {
  // 解析JWT token（如果可能）
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token 过期时间:', new Date(payload.exp * 1000));
    console.log('Token 是否过期:', new Date() > new Date(payload.exp * 1000));
  } catch (error) {
    console.log('无法解析token:', error);
  }
} else {
  console.log('没有找到token');
} 