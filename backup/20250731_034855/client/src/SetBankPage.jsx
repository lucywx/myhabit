import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserCenterModal from './UserCenterModal';
import MyHabitsPopup from './MyHabitsPopup';
import InviteFriendModal from './InviteFriendModal';
import SettingsPopup from './SettingsPopup';
import TransferRecordsPopup from './TransferRecordsPopup';

function SetBankPage({ user }) {
  const navigate = useNavigate();
  const [bankData, setBankData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    cardType: '',
    expiryDate: '',
    cvv: '',
    branchName: ''
  });
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bank-info/set-bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bankData)
      });

      if (response.ok) {
        // 设置银行信息成功后，跳转到下一步

        // 更新用户进度
        try {
          const progressResponse = await fetch('/api/user/update-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ step: 'bank' })
          });

          if (progressResponse.ok) {
            console.log('✅ 进度已更新到 bank');
          }
        } catch (error) {
          console.error('更新进度失败:', error);
        }

        navigate('/checkin');
      } else {
        console.error('Failed to set bank info');
      }
    } catch (error) {
      console.error('Error setting bank info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkip = async () => {
    // 跳过时也更新进度到checkin
    try {
      const token = localStorage.getItem('token');
      const progressResponse = await fetch('/api/user/update-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ step: 'checkin' })
      });

      if (progressResponse.ok) {
        console.log('✅ 跳过银行设置，进度已更新到 checkin');
      }
    } catch (error) {
      console.error('更新进度失败:', error);
    }

    navigate('/checkin');
  };

  return (
    <div>
      <UserAvatar user={user} onClick={openUserCenterModal} />
      <div className="page-header">
        <div className="header-content">
          <h1>设置银行信息</h1>
          <p>第3步：完善银行账户信息</p>
        </div>
      </div>

      <div className="page-container">
        <div className="card">
          <h2>设置银行信息</h2>
          <p>为了处理价格转账，我们需要您的银行账户信息。请放心，我们会严格保护您的隐私。</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>银行名称 *</label>
              <input
                type="text"
                name="bankName"
                value={bankData.bankName}
                onChange={handleChange}
                placeholder="例如：中国银行"
                required
              />
            </div>

            <div className="form-group">
              <label>账户持有人姓名 *</label>
              <input
                type="text"
                name="accountName"
                value={bankData.accountName}
                onChange={handleChange}
                placeholder="与银行卡一致的姓名"
                required
              />
            </div>

            <div className="form-group">
              <label>银行卡号 *</label>
              <input
                type="text"
                name="accountNumber"
                value={bankData.accountNumber}
                onChange={handleChange}
                placeholder="16-19位银行卡号"
                required
              />
            </div>

            <div className="form-group">
              <label>卡片类型 *</label>
              <select
                name="cardType"
                value={bankData.cardType}
                onChange={handleChange}
                required
              >
                <option value="">请选择卡片类型</option>
                <option value="debit">借记卡</option>
                <option value="credit">信用卡</option>
              </select>
            </div>

            <div className="form-group">
              <label>有效期 *</label>
              <input
                type="text"
                name="expiryDate"
                value={bankData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
            </div>

            <div className="form-group">
              <label>CVV *</label>
              <input
                type="text"
                name="cvv"
                value={bankData.cvv}
                onChange={handleChange}
                placeholder="3-4位安全码"
                required
              />
            </div>

            <div className="form-group">
              <label>开户行（可选）</label>
              <input
                type="text"
                name="branchName"
                value={bankData.branchName}
                onChange={handleChange}
                placeholder="开户行名称"
              />
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '设置中...' : '完成设置，开始习惯养成'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSkip}
              >
                SKIP
              </button>
            </div>
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

export default SetBankPage; 