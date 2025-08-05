#!/bin/bash

echo "🚀 开始部署 MyHabit 到 Vercel..."

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

# 进入客户端目录
cd client

# 构建项目
echo "🔨 构建前端项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 部署到Vercel
echo "🚀 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "🌐 你的应用现在可以通过 Vercel 提供的域名访问"
echo "📧 邀请邮件中的链接现在指向公网地址" 