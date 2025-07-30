import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';
import UserAvatar from './UserAvatar';
import UserCenterModal from './UserCenterModal';
import MyHabitsPopup from './MyHabitsPopup';
import InviteFriendModal from './InviteFriendModal';
import SettingsPopup from './SettingsPopup';
import TransferRecordsPopup from './TransferRecordsPopup';

function SetPricePage({ user }) {
  const navigate = useNavigate();
  const [priceData, setPriceData] = useState({
    amount: '',
    friendEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ currentStep: 'price', completedSteps: [] });
  const [showUserCenterModal, setShowUserCenterModal] = useState(false);
  const [showMyHabitsPopup, setShowMyHabitsPopup] = useState(false);
  const [showInviteFriendModal, setShowInviteFriendModal] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showTransferRecordsPopup, setShowTransferRecordsPopup] = useState(false);

  // 获取用户进度
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/get-progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('获取进度失败:', error);
      }
    };

    fetchProgress();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!priceData.amount || !priceData.friendEmail) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? '存在' : '不存在');

      const requestData = {
        enabled: true,
        amount: parseInt(priceData.amount),
        type: 'friend',
        friendEmail: priceData.friendEmail
      };

      console.log('📤 发送数据:', requestData);

      const response = await fetch('/api/user/update-price', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('📡 响应状态:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 设置价格成功:', data);

        // 更新用户进度
        try {
          const progressResponse = await fetch('/api/user/update-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ step: 'price' })
          });

          if (progressResponse.ok) {
            console.log('✅ 进度已更新到 price');
          }
        } catch (error) {
          console.error('更新进度失败:', error);
        }

        navigate('/set-bank');
      } else {
        const errorData = await response.json();
        console.error('❌ 设置价格失败:', errorData);
        alert('设置价格失败，请重试');
      }
    } catch (error) {
      console.error('💥 网络错误:', error);
      alert('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPriceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dailyAmount = priceData.amount ? Math.round(priceData.amount / 7) : 0;

  return (
    <div>
      <ProgressIndicator currentStep={progress.currentStep} completedSteps={progress.completedSteps} />
      <UserAvatar user={user} onClick={openUserCenterModal} />
      <div className="page-container">
        <div className="goal-card">
          <div className="price-text">
            Send $<input
              type="number"
              name="amount"
              value={priceData.amount}
              onChange={handleChange}
              placeholder="10"
              className="price-input"
              min="1"
              max="1000"
            /> to @<input
              type="email"
              name="friendEmail"
              value={priceData.friendEmail}
              onChange={handleChange}
              placeholder="friend@email.com"
              className="price-input"
            />.
          </div>

          <div className="price-text">
            Each check-in earns back $<span className="daily-amount">{dailyAmount}</span>.
          </div>

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="goal-button"
              disabled={loading || !priceData.amount || !priceData.friendEmail}
            >
              {loading ? '设置中...' : 'SET PRICE'}
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

export default SetPricePage; 