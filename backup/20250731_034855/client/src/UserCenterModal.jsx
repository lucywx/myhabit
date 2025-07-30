import React from 'react';
import './UserCenterModal.css';

function UserCenterModal({ isOpen, onClose, user, onOpenMyHabits, onOpenTransferRecords, onOpenInviteFriend, onOpenSettings, onSignOut }) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSignOut = () => {
        onSignOut();
        onClose();
    };

    return (
        <div className="user-center-modal-backdrop" onClick={handleBackdropClick}>
            <div className="user-center-modal">
                <div className="modal-header">
                    <h3>用户中心</h3>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    <div className="user-info">
                        <div className="user-avatar-large">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="用户头像" />
                            ) : (
                                <div className="avatar-fallback-large">
                                    {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="user-details">
                            <h4>{user?.username || '用户'}</h4>
                            <p>{user?.email || ''}</p>
                        </div>
                    </div>

                    <div className="menu-items">
                        <div className="menu-item" onClick={onOpenMyHabits}>
                            <div className="menu-icon">📊</div>
                            <span>我的习惯</span>
                            <div className="menu-arrow">›</div>
                        </div>

                        <div className="menu-item" onClick={onOpenTransferRecords}>
                            <div className="menu-icon">💰</div>
                            <span>转账记录</span>
                            <div className="menu-arrow">›</div>
                        </div>

                        <div className="menu-item" onClick={onOpenInviteFriend}>
                            <div className="menu-icon">👥</div>
                            <span>邀请朋友</span>
                            <div className="menu-arrow">›</div>
                        </div>

                        <div className="menu-item" onClick={onOpenSettings}>
                            <div className="menu-icon">⚙️</div>
                            <span>设置</span>
                            <div className="menu-arrow">›</div>
                        </div>

                        <div className="menu-item sign-out" onClick={handleSignOut}>
                            <div className="menu-icon">🚪</div>
                            <span>退出登录</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserCenterModal; 