// 测试正则表达式是否能匹配用户666的照片文件名
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');
const userId = '688707596bbbb98d00a079be';

console.log('🔍 测试正则表达式匹配...');

// 检查第1天的照片
const day = 1;
const pattern = new RegExp(`^day-${day}-${userId}-\\d+\\.(jpg|jpeg|png|gif)$`);
console.log('正则表达式:', pattern);

const files = fs.readdirSync(uploadDir);
console.log(`uploads目录包含 ${files.length} 个文件`);

// 查找用户666相关的文件
const userFiles = files.filter(file => file.includes(userId));
console.log('用户666相关的文件:');
userFiles.forEach(file => {
  console.log(`  - ${file}`);
  const isMatch = pattern.test(file);
  console.log(`    匹配结果: ${isMatch ? '✅ 匹配' : '❌ 不匹配'}`);
});

// 特别检查第1天的照片
const day1Pattern = new RegExp(`^day-1-${userId}-\\d+\\.(jpg|jpeg|png|gif)$`);
const day1File = files.find(f => day1Pattern.test(f));

if (day1File) {
  console.log(`✅ 找到第1天照片: ${day1File}`);
} else {
  console.log('❌ 没有找到第1天照片');
}

// 手动测试具体的文件名
const testFileName = 'day-1-688707596bbbb98d00a079be-1753690865894.jpeg';
console.log(`\n手动测试文件名: ${testFileName}`);
console.log('匹配结果:', day1Pattern.test(testFileName)); 