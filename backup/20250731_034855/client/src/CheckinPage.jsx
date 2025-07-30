import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserCenterModal from './UserCenterModal';
import MyHabitsPopup from './MyHabitsPopup';
import InviteFriendModal from './InviteFriendModal';
import SettingsPopup from './SettingsPopup';
import TransferRecordsPopup from './TransferRecordsPopup';

function CheckinPage({ user }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [checkins, setCheckins] = useState({});
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [totalAmount, setTotalAmount] = useState(70); // 默认金额
  const [showUserCenterModal, setShowUserCenterModal] = useState(false);
  const [showMyHabitsPopup, setShowMyHabitsPopup] = useState(false);
  const [showInviteFriendModal, setShowInviteFriendModal] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showTransferRecordsPopup, setShowTransferRecordsPopup] = useState(false);

  // 弹窗控制函数
  const openUserCenterModal = () => setShowUserCenterModal(true);
  const closeUserCenterModal = () => setShowUserCenterModal(false);
  const openMyHabitsPopup = () => {
    setShowMyHabitsPopup(true);
    setShowUserCenterModal(false);
  };
  const closeMyHabitsPopup = () => setShowMyHabitsPopup(false);
  const openInviteFriendModal = () => {
    setShowInviteFriendModal(true);
    setShowUserCenterModal(false);
  };
  const closeInviteFriendModal = () => setShowInviteFriendModal(false);
  const openSettingsPopup = () => {
    setShowSettingsPopup(true);
    setShowUserCenterModal(false);
  };
  const closeSettingsPopup = () => setShowSettingsPopup(false);
  const openTransferRecordsPopup = () => {
    setShowTransferRecordsPopup(true);
    setShowUserCenterModal(false);
  };
  const closeTransferRecordsPopup = () => setShowTransferRecordsPopup(false);
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // 获取总金额
  const getTotalAmount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/get-price', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const amount = data.priceSettings?.amount || 70;
        setTotalAmount(amount);
        return amount;
      }
    } catch (error) {
      console.error('获取价格设置失败:', error);
    }
    return totalAmount;
  };

  // 生成7天的数据
  const days = Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    date: startDate ? new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000) : null,
    isCompleted: false,
    imageUrl: null
  }));

  // 获取当前日期（只保留日期部分，不包含时间）
  const getCurrentDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  // 检查是否可以打卡
  const canCheckin = (dayIndex) => {
    if (!startDate) return true; // 第一次打卡可以设置开始日期
    const dayDate = new Date(startDate.getTime() + dayIndex * 24 * 60 * 60 * 1000);
    const currentDate = getCurrentDate();
    return dayDate <= currentDate;
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    console.log('📂 文件选择事件触发');
    const file = event.target.files[0];
    if (file) {
      console.log('📁 选择了文件:', file.name, file.size, file.type);
      console.log('📅 准备上传到第', selectedDay, '天');
      uploadImage(file, selectedDay);
    } else {
      console.log('❌ 没有选择文件');
    }
  };

  // 上传图片
  const uploadImage = async (file, dayNumber) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const dayIndex = dayNumber - 1; // 转换为0-6的索引
      console.log('🔑 Token:', token ? '存在' : '不存在');
      console.log('📁 文件:', file.name, file.size, file.type);
      console.log('📅 天数:', dayNumber, '索引:', dayIndex);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('day', dayNumber);

      const endpoint = checkins[dayIndex] ? `/api/progress/reupload/${dayNumber}` : '/api/progress/upload-checkin-image';
      console.log('🌐 请求端点:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📡 响应状态:', response.status);
      console.log('📡 响应头:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 打卡成功:', data);
        console.log('📸 图片URL:', data.imageUrl);
        console.log('📅 天数:', data.day);

        // 计算返回的金额（总金额/7天）
        const totalAmount = await getTotalAmount();
        const dailyAmount = Math.round(totalAmount / 7);

        // 更新本地状态
        const newCheckins = {
          ...checkins,
          [dayIndex]: {
            imageUrl: data.imageUrl || URL.createObjectURL(file),
            timestamp: new Date().toISOString(),
            dailyAmount: dailyAmount
          }
        };

        console.log('🔄 更新打卡状态:', newCheckins);
        setCheckins(newCheckins);

        // 如果是第一次打卡，设置开始日期并更新进度
        if (!startDate) {
          const today = getCurrentDate();
          setStartDate(today);

          // 更新用户进度到checkin
          try {
            const progressResponse = await fetch('/api/user/update-progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ step: 'checkin' })
            });

            if (progressResponse.ok) {
              console.log('✅ 第一次打卡，进度已更新到 checkin');
            }
          } catch (error) {
            console.error('更新进度失败:', error);
          }
        }
      } else {
        const errorData = await response.json();
        console.error('❌ 打卡失败:', errorData);
        alert(`打卡失败: ${errorData.message || '请重试'}`);
      }
    } catch (error) {
      console.error('💥 上传错误:', error);
      alert('网络错误，请重试');
    } finally {
      setLoading(false);
      setSelectedDay(null);
    }
  };

  // 处理方块点击
  const handleDayClick = (dayIndex) => {
    const dayNumber = dayIndex + 1; // 转换为1-7的天数
    console.log('🖱️ 点击了第', dayNumber, '天');

    if (!canCheckin(dayIndex)) {
      alert('不能提前打卡噢');
      return;
    }

    console.log('✅ 可以打卡，设置选中天数为:', dayNumber);
    setSelectedDay(dayNumber);

    console.log('📁 触发文件选择器');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('❌ 文件输入引用不存在');
    }
  };

  // 加载已有的打卡数据和价格设置
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');

        // 加载打卡数据
        const checkinResponse = await fetch('/api/progress/get-checkins', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (checkinResponse.ok) {
          const data = await checkinResponse.json();
          setCheckins(data.checkins || {});
          if (data.startDate) {
            setStartDate(new Date(data.startDate));
          }
        }

        // 加载价格设置
        await getTotalAmount();
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <UserAvatar user={user} onClick={openUserCenterModal} />
      <div className="page-container">
        <div className="checkin-card">
          <div className="checkin-grid">
            {days.map((day, index) => (
              <div
                key={index}
                className={`checkin-day ${checkins[index] ? 'completed' : ''} ${!canCheckin(index) ? 'disabled' : ''}`}
                onClick={() => handleDayClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="day-number">{day.day}</div>
                {checkins[index] ? (
                  <div className="checkin-image">
                    <img src={checkins[index].imageUrl} alt={`Day ${day.day}`} />
                    <div className="amount-stamp positive">
                      +${checkins[index].dailyAmount || Math.round(totalAmount / 7)}
                    </div>
                  </div>
                ) : canCheckin(index) ? (
                  <div className="checkin-image-placeholder">
                    <div className="amount-stamp negative">
                      -${Math.round(totalAmount / 7)}
                    </div>
                    <div className="upload-placeholder">+</div>
                  </div>
                ) : (
                  <div className="disabled-text">🔒</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* 加载遮罩 */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">上传中...</div>
        </div>
      )}

      {/* 弹窗组件 */}
      <UserCenterModal
        isOpen={showUserCenterModal}
        onClose={closeUserCenterModal}
        user={user}
        onOpenMyHabits={openMyHabitsPopup}
        onOpenTransferRecords={openTransferRecordsPopup}
        onOpenInviteFriend={openInviteFriendModal}
        onOpenSettings={openSettingsPopup}
        onSignOut={handleSignOut}
      />
      <MyHabitsPopup
        isOpen={showMyHabitsPopup}
        onClose={closeMyHabitsPopup}
        user={user}
      />
      <InviteFriendModal
        isOpen={showInviteFriendModal}
        onClose={closeInviteFriendModal}
      />
      <SettingsPopup
        isOpen={showSettingsPopup}
        onClose={closeSettingsPopup}
        user={user}
      />
      <TransferRecordsPopup
        isOpen={showTransferRecordsPopup}
        onClose={closeTransferRecordsPopup}
      />
    </div>
  );
}

export default CheckinPage; 