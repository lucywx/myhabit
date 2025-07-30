import React, { useState } from 'react';

function InviteFriendModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        friendName: '',
        friendEmail: '',
        friendPhone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/invite/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess('邀请发送成功！');
                setFormData({
                    friendName: '',
                    friendEmail: '',
                    friendPhone: '',
                    message: ''
                });
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || '邀请发送失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                    <h3 style={{ margin: 0, color: '#333' }}>邀请朋友</h3>
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

                {error && (
                    <div style={{
                        color: '#d32f2f',
                        backgroundColor: '#ffebee',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        color: '#2e7d32',
                        backgroundColor: '#e8f5e8',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            朋友姓名 *
                        </label>
                        <input
                            type="text"
                            name="friendName"
                            value={formData.friendName}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            邮箱地址
                        </label>
                        <input
                            type="email"
                            name="friendEmail"
                            value={formData.friendEmail}
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

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            手机号码
                        </label>
                        <input
                            type="tel"
                            name="friendPhone"
                            value={formData.friendPhone}
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

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            邀请消息
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            placeholder="写一条个性化的邀请消息..."
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            type="button"
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
                            type="submit"
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
                            {loading ? '发送中...' : '发送邀请'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InviteFriendModal; 