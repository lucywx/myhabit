// 测试客户端的打卡逻辑
const startDate = new Date('2025-07-27T16:00:00.000Z'); // 用户simon的startDate
const today = new Date();

console.log('🔍 测试客户端打卡逻辑...');
console.log('📅 开始日期:', startDate.toDateString());
console.log('📅 当前日期:', today.toDateString());

const diffTime = today - startDate;
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
const todayShouldCompleteDay = Math.max(1, diffDays + 1);

console.log('📊 计算结果:');
console.log('   - 时间差(毫秒):', diffTime);
console.log('   - 天数差:', diffDays);
console.log('   - 今天应该打卡第几天:', todayShouldCompleteDay);

// 测试第2天是否可以打卡
const dayToCheck = 2;
if (dayToCheck === todayShouldCompleteDay) {
  console.log(`✅ 第${dayToCheck}天可以打卡！`);
} else {
  console.log(`❌ 第${dayToCheck}天不能打卡，应该打卡第${todayShouldCompleteDay}天`);
}

// 测试所有天的状态
console.log('\n📋 所有天的打卡状态:');
for (let day = 1; day <= 7; day++) {
  if (day === todayShouldCompleteDay) {
    console.log(`   ${day}: ✅ 可以打卡`);
  } else if (day < todayShouldCompleteDay) {
    console.log(`   ${day}: ❌ 已经过期`);
  } else {
    console.log(`   ${day}: ⏳ 还不能打卡`);
  }
} 