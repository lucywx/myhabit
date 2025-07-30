#!/bin/bash

# 设置系统级自动备份

echo "设置系统级自动备份..."

# 创建备份目录
mkdir -p ~/myhabit-backups

# 创建cron任务 - 每10分钟备份一次
(crontab -l 2>/dev/null; echo "*/10 * * * * /Users/lucyy/myhabit-app/auto-backup.sh >> /Users/lucyy/myhabit-backups/backup.log 2>&1") | crontab -

# 创建每日完整备份
(crontab -l 2>/dev/null; echo "0 2 * * * tar -czf ~/myhabit-backups/myhabit-$(date +%Y%m%d).tar.gz /Users/lucyy/myhabit-app --exclude=node_modules --exclude=.git") | crontab -

echo "自动备份设置完成！"
echo "备份日志位置: ~/myhabit-backups/backup.log"
echo "每日备份位置: ~/myhabit-backups/" 