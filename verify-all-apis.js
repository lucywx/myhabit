// 验证所有API调用是否都使用了正确的路径
const fs = require('fs');
const path = require('path');

// 正确的API路径
const CORRECT_APIS = {
  'goals': ['get-goal', 'set-goal'],
  'progress': ['get-checkin-image', 'upload-checkin-image'],
  'user': ['get-punishment-settings', 'update-punishment-settings', 'set-punishment-settings', 'disable-punishment-settings'],
  'bank-info': ['get-bank-info', 'set-bank-info'],
  'upload': ['upload-avatar']
};

// 错误的API路径（旧版本）
const WRONG_APIS = {
  'goals': ['current-goal'],
  'progress': ['day-images', 'upload-day-image'],
  'user': ['punishment-settings'],
  'bank-info': ['bank-info'],
  'upload': ['upload-avatar'] // 这个是正确的
};

// 需要检查的文件列表
const FILES_TO_CHECK = [
  'client/src/LoginPage.jsx',
  'client/src/ProgressPage.jsx',
  'client/src/SetGoalPage.jsx',
  'client/src/PunishmentSettingsPage.jsx',
  'client/src/MyHabitsPage.jsx',
  'client/src/BankInfoPage.jsx',
  'client/src/UserCenter.jsx',
  'client/src/UserAccountPopup.jsx',
  'client/src/TransferRecordsPage.jsx'
];

function verifyApiCalls() {
  console.log('🔍 验证所有API调用...');
  
  let totalIssues = 0;
  
  FILES_TO_CHECK.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`\n📁 检查文件: ${filePath}`);
      
      const content = fs.readFileSync(filePath, 'utf8');
      let fileIssues = 0;
      
      // 检查错误的API调用
      Object.entries(WRONG_APIS).forEach(([endpoint, wrongApis]) => {
        wrongApis.forEach(wrongApi => {
          const patterns = [
            // 匹配 `${API_BASE}/api/...` 格式
            new RegExp(`\\$\\{API_BASE\\}/api/${endpoint}/${wrongApi.replace('-', '\\-')}`, 'g'),
            // 匹配 `/api/...` 格式
            new RegExp(`/api/${endpoint}/${wrongApi.replace('-', '\\-')}`, 'g'),
            // 匹配 `api/...` 格式
            new RegExp(`api/${endpoint}/${wrongApi.replace('-', '\\-')}`, 'g')
          ];
          
          patterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              console.log(`  ❌ 发现错误的API调用: ${matches[0]}`);
              fileIssues++;
              totalIssues++;
            }
          });
        });
      });
      
      // 检查正确的API调用
      Object.entries(CORRECT_APIS).forEach(([endpoint, correctApis]) => {
        correctApis.forEach(correctApi => {
          const patterns = [
            // 匹配 `${API_BASE}/api/...` 格式
            new RegExp(`\\$\\{API_BASE\\}/api/${endpoint}/${correctApi.replace('-', '\\-')}`, 'g'),
            // 匹配 `/api/...` 格式
            new RegExp(`/api/${endpoint}/${correctApi.replace('-', '\\-')}`, 'g'),
            // 匹配 `api/...` 格式
            new RegExp(`api/${endpoint}/${correctApi.replace('-', '\\-')}`, 'g')
          ];
          
          patterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              console.log(`  ✅ 发现正确的API调用: ${matches[0]}`);
            }
          });
        });
      });
      
      if (fileIssues === 0) {
        console.log(`  ✅ 所有API调用都正确`);
      } else {
        console.log(`  ❌ 发现 ${fileIssues} 个问题`);
      }
    } else {
      console.log(`\n❌ 文件不存在: ${filePath}`);
    }
  });
  
  console.log(`\n📊 验证总结:`);
  console.log(`  总问题数: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log(`  🎉 所有API调用都正确！`);
  } else {
    console.log(`  ⚠️  还有 ${totalIssues} 个API调用需要修复`);
  }
  
  // 显示正确的API列表
  console.log(`\n📋 正确的API列表:`);
  Object.entries(CORRECT_APIS).forEach(([endpoint, apis]) => {
    apis.forEach(api => {
      console.log(`  /api/${endpoint}/${api}`);
    });
  });
}

verifyApiCalls(); 