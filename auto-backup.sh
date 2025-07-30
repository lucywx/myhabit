#!/bin/bash

# 自动备份脚本
# 每5分钟自动提交代码到Git

PROJECT_DIR="/Users/lucyy/myhabit-app"
BACKUP_BRANCH="auto-backup-$(date +%Y%m%d)"

echo "开始自动备份 - $(date)"

cd "$PROJECT_DIR"

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "发现未提交的更改，正在备份..."
    
    # 添加所有文件
    git add .
    
    # 创建备份提交
    git commit -m "自动备份 - $(date '+%Y-%m-%d %H:%M:%S')"
    
    # 推送到远程备份分支
    git push origin HEAD:$BACKUP_BRANCH
    
    echo "备份完成 - $(date)"
else
    echo "没有新的更改需要备份"
fi 