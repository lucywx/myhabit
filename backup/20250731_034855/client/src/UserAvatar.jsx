import React from 'react';
import './UserAvatar.css';

function UserAvatar({ user, onClick }) {
    // 获取用户头像URL，如果没有则使用默认头像
    const avatarUrl = user?.avatarUrl || 'https://via.placeholder.com/40x40/007bff/ffffff?text=U';

    // 获取用户名的首字母作为默认头像
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="user-avatar" onClick={onClick}>
            {user?.avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="用户头像"
                    className="avatar-image"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}
            <div className="avatar-fallback">
                {getInitials(user?.username || user?.email)}
            </div>
        </div>
    );
}

export default UserAvatar; 