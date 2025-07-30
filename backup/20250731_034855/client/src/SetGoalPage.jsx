import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserCenterModal from './UserCenterModal';
import MyHabitsPopup from './MyHabitsPopup';
import InviteFriendModal from './InviteFriendModal';
import SettingsPopup from './SettingsPopup';
import TransferRecordsPopup from './TransferRecordsPopup';

function SetGoalPage({ user }) {
  const navigate = useNavigate();
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
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

  const placeholders = [
    '不喝咖啡',
    '12点前睡觉',
    '步行上楼梯'
  ];

  // 轮播提示文字
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? '存在' : '不存在');

      const requestData = {
        goalContent: goal
      };

      console.log('📤 发送数据:', requestData);

      const response = await fetch('/api/goals/set-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('📡 响应状态:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 设置目标成功:', data);

        // 更新用户进度
        try {
          const progressResponse = await fetch('/api/user/update-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ step: 'goal' })
          });

          if (progressResponse.ok) {
            console.log('✅ 进度已更新到 goal');
          }
        } catch (error) {
          console.error('更新进度失败:', error);
        }

        navigate('/set-price');
      } else {
        const errorData = await response.json();
        console.error('❌ 设置目标失败:', errorData);
        alert('设置目标失败，请重试');
      }
    } catch (error) {
      console.error('💥 网络错误:', error);
      alert('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UserAvatar user={user} onClick={openUserCenterModal} />
      <div className="page-container">
        <div className="goal-card">
          <div className="goal-slogan">BE SPECIFIC, START SMALL</div>

          <form onSubmit={handleSubmit}>
            <div className="goal-input-container">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="goal-input"
                required
              />
            </div>

            <button
              type="submit"
              className="goal-button"
              disabled={loading || !goal.trim()}
            >
              {loading ? '设置中...' : 'SET MY DAILY GOAL'}
            </button>
          </form>
        </div>
      </div>

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

export default SetGoalPage; 