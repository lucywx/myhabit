#!/bin/bash

# 设置系统级自动备份 - 每天两次

echo "设置系统级自动备份..."

# 创建备份目录
mkdir -p ~/myhabit-backups

# 删除旧的cron任务
crontab -l 2>/dev/null | grep -v "myhabit-app/auto-backup.sh" | crontab -

# 创建新的cron任务 - 每天中午12点和凌晨12点备份
(crontab -l 2>/dev/null; echo "0 12 * * * /Users/lucyy/myhabit-app/auto-backup.sh >> /Users/lucyy/myhabit-backups/backup.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 0 * * * /Users/lucyy/myhabit-app/auto-backup.sh >> /Users/lucyy/myhabit-backups/backup.log 2>&1") | crontab -

echo "自动备份设置完成！"
echo "备份时间: 每天中午12:00 和 凌晨00:00"
echo "保留备份: 最近4个"
echo "备份日志位置: ~/myhabit-backups/backup.log"
echo "本地备份位置: ~/myhabit-backups/" 