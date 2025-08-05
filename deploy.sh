#!/bin/bash

echo "🚀 开始部署 MyHabit Web版..."

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查npm环境
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装npm"
    exit 1
fi

echo "✅ 环境检查通过"

# 安装依赖
echo "📦 安装客户端依赖..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ 客户端依赖安装失败"
    exit 1
fi

echo "📦 安装服务端依赖..."
cd ../server
npm install
if [ $? -ne 0 ]; then
    echo "❌ 服务端依赖安装失败"
    exit 1
fi

# 构建客户端
echo "🔨 构建客户端..."
cd ../client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 客户端构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 启动服务
echo "🚀 启动服务..."
cd ../server
echo "📊 服务将在 http://localhost:5000 启动"
echo "📱 客户端将在 http://localhost:3000 启动"
echo ""
echo "💡 提示："
echo "   - 访问 http://localhost:3000 查看应用"
echo "   - 访问 http://localhost:3000/test 进行功能测试"
echo "   - 按 Ctrl+C 停止服务"
echo ""

# 启动服务器
npm start 