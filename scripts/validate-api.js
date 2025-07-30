#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 从 API_CONTRACT.md 中提取有效的 API 端点
function extractValidEndpoints() {
  const contractPath = path.join(__dirname, '..', 'API_CONTRACT.md');
  const content = fs.readFileSync(contractPath, 'utf8');
  
  const endpoints = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // 修复正则表达式：匹配 `METHOD /path` 格式
    const match = line.match(/`([A-Z]+)\s+([^`]+)`/);
    if (match) {
      const method = match[1];
      const path = match[2].trim();
      endpoints.push(`${method} ${path}`);
    }
  }
  
  console.log('📋 有效的 API 端点:');
  endpoints.forEach(endpoint => console.log(`  - ${endpoint}`));
  console.log('');
  
  return endpoints;
}

// 从客户端代码中提取 API 调用
function extractClientApiCalls() {
  const clientDir = path.join(__dirname, '..', 'client', 'src');
  const apiCalls = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = content.match(/\${API_BASE}\/api\/[^`'"]+/g);
        
        if (matches) {
          matches.forEach(match => {
            const endpoint = match.replace('${API_BASE}', '').trim();
            apiCalls.push({
              file: filePath,
              endpoint: endpoint
            });
          });
        }
      }
    }
  }
  
  scanDirectory(clientDir);
  
  console.log('📞 客户端 API 调用:');
  apiCalls.forEach(call => console.log(`  - ${call.endpoint} (${call.file})`));
  console.log('');
  
  return apiCalls;
}

// 验证 API 调用
function validateApiCalls() {
  const validEndpoints = extractValidEndpoints();
  const clientApiCalls = extractClientApiCalls();
  
  console.log('🔍 验证 API 调用...\n');
  
  let hasErrors = false;
  
  for (const call of clientApiCalls) {
    // 修复验证逻辑：检查端点是否在有效端点列表中
    const isValid = validEndpoints.some(endpoint => {
      const endpointPath = endpoint.split(' ')[1]; // 提取路径部分
      const matches = call.endpoint === endpointPath;
      console.log(`  检查: "${call.endpoint}" === "${endpointPath}" -> ${matches}`);
      return matches;
    });
    
    if (!isValid) {
      console.log(`❌ 无效的 API 调用: ${call.endpoint}`);
      console.log(`   文件: ${call.file}\n`);
      hasErrors = true;
    } else {
      console.log(`✅ 有效的 API 调用: ${call.endpoint}`);
    }
  }
  
  if (!hasErrors) {
    console.log('\n🎉 所有 API 调用都有效！');
  } else {
    console.log('\n💡 请检查 API_CONTRACT.md 或修复无效的 API 调用');
    process.exit(1);
  }
}

// 运行验证
validateApiCalls(); 