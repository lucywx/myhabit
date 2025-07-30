#!/bin/bash

# 每日自动提交脚本
# 使用方法：./daily-commit.sh

# 设置工作目录
cd /Users/lucyy/myhabit-app

# 获取当前日期
DATE=$(date '+%Y-%m-%d')

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "🔄 发现未提交的更改，正在提交..."
    
    # 添加所有更改
    git add .
    
    # 提交更改
    git commit -m "Daily commit - $DATE - Auto save changes"
    
    echo "✅ 每日提交完成: $DATE"
    
    # 可选：推送到远程仓库
    # git push origin main
    
else
    echo "📝 没有发现未提交的更改 - $DATE"
fi 