#!/bin/bash

# 自动备份脚本 - 每天两次备份
# 上午9点和晚上9点自动备份，只保留最近4个备份

PROJECT_DIR="/Users/lucyy/myhabit-app"
BACKUP_BRANCH="auto-backup-$(date +%Y%m%d)"
TIMESTAMP=$(date +%H%M%S)

echo "开始自动备份 - $(date)"

cd "$PROJECT_DIR"

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "发现未提交的更改，正在备份..."
    
    # 添加所有文件
    git add .
    
    # 创建带时间戳的备份提交
    git commit -m "自动备份 - $(date '+%Y-%m-%d %H:%M:%S') - $TIMESTAMP"
    
    # 推送到远程备份分支
    git push origin HEAD:$BACKUP_BRANCH
    
    # 清理旧的Git备份分支（只保留最近4个）
    git branch -r | grep "origin/auto-backup" | sort -r | tail -n +5 | while read branch; do
        branch_name=$(echo $branch | sed 's/origin\///')
        echo "删除旧备份分支: $branch_name"
        git push origin --delete $branch_name 2>/dev/null || true
    done
    
    # 创建本地时间戳备份
    BACKUP_FILE="~/myhabit-backups/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "$BACKUP_FILE" . --exclude=node_modules --exclude=.git
    
    # 清理旧的本地备份（只保留最近4个）
    ls -t ~/myhabit-backups/backup-*.tar.gz 2>/dev/null | tail -n +5 | xargs rm -f 2>/dev/null || true
    
    echo "备份完成 - $(date)"
    echo "本地备份: $BACKUP_FILE"
    echo "GitHub备份: $BACKUP_BRANCH"
    echo "保留备份数量: 4个"
else
    echo "没有新的更改需要备份"
fi 