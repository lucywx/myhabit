import React, { useState, useEffect } from 'react';

function UserAccountPopup({ isOpen, onClose, user }) {
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        phone: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen && user) {
            setUserInfo({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || ''
            });
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/upload-avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(prev => ({
                    ...prev,
                    avatar: data.avatarUrl
                }));
                setMessage('头像上传成功！');
            } else {
                setMessage('头像上传失败');
            }
        } catch (error) {
            setMessage('上传出错，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userInfo)
            });

            if (response.ok) {
                setMessage('个人信息更新成功！');
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setMessage('更新失败，请重试');
            }
        } catch (error) {
            setMessage('网络错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: 0, color: '#333' }}>用户账户</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ×
                    </button>
                </div>

                {message && (
                    <div style={{
                        color: message.includes('成功') ? '#2e7d32' : '#d32f2f',
                        backgroundColor: message.includes('成功') ? '#e8f5e8' : '#ffebee',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            margin: '0 auto 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {userInfo.avatar ? (
                                <img
                                    src={userInfo.avatar}
                                    alt="Avatar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '24px', color: '#666' }}>
                                    {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U'}
                                </span>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                            id="avatar-upload"
                        />
                        <label
                            htmlFor="avatar-upload"
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#6772e5',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {loading ? '上传中...' : '更换头像'}
                        </label>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            用户名
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={userInfo.username}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            邮箱
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            手机号码
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    marginTop: '20px'
                }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '10px 20px',
                            border: '1px solid #dc3545',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            color: '#dc3545',
                            cursor: 'pointer'
                        }}
                    >
                        退出登录
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: '#fff',
                                color: '#666',
                                cursor: 'pointer'
                            }}
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: loading ? '#ccc' : '#6772e5',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? '保存中...' : '保存'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserAccountPopup; 