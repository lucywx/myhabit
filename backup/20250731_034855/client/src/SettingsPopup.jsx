import React, { useState } from 'react';

function SettingsPopup({ isOpen, onClose, user }) {
    const [settings, setSettings] = useState({
        notifications: true,
        emailUpdates: false,
        language: 'zh-CN',
        theme: 'light'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                console.log('Settings saved successfully');
                onClose();
            } else {
                console.error('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
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
                maxWidth: '400px',
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
                    <h3 style={{ margin: 0, color: '#333' }}>设置</h3>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={settings.notifications}
                                onChange={handleChange}
                            />
                            <span>推送通知</span>
                        </label>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                name="emailUpdates"
                                checked={settings.emailUpdates}
                                onChange={handleChange}
                            />
                            <span>邮件更新</span>
                        </label>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            语言
                        </label>
                        <select
                            name="language"
                            value={settings.language}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        >
                            <option value="zh-CN">中文</option>
                            <option value="en-US">English</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            主题
                        </label>
                        <select
                            name="theme"
                            value={settings.theme}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        >
                            <option value="light">浅色</option>
                            <option value="dark">深色</option>
                        </select>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end',
                    marginTop: '20px'
                }}>
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
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#6772e5',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPopup; 