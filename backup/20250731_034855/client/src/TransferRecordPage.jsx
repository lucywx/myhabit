import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function TransferRecordPage({ user }) {
    const [transferLogs, setTransferLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadTransferLogs();
    }, [loadTransferLogs]);

    const loadTransferLogs = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('/api/mock-payment/transfers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTransferLogs(data.transfers || []);
            } else {
                console.error('Failed to load transfer logs');
            }
        } catch (error) {
            console.error('Error loading transfer logs:', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransferTypeColor = (type) => {
        switch (type) {
            case 'outgoing':
                return '#ff6b6b';
            case 'incoming':
                return '#51cf66';
            default:
                return '#868e96';
        }
    };

    const getTransferTypeText = (type) => {
        switch (type) {
            case 'outgoing':
                return '转出';
            case 'incoming':
                return '转入';
            default:
                return '未知';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#51cf66';
            case 'pending':
                return '#ffd43b';
            case 'failed':
                return '#ff6b6b';
            default:
                return '#868e96';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return '已完成';
            case 'pending':
                return '处理中';
            case 'failed':
                return '失败';
            default:
                return '未知';
        }
    };

    if (loading) {
        return (
            <div>
                <nav className="nav-bar">
                    <div className="nav-container">
                        <h2>MyHabit App</h2>
                        <div className="nav-links">
                            <Link to="/home">首页</Link>
                            <Link to="/my-habits">我的习惯</Link>
                            <Link to="/checkin">打卡</Link>
                            <Link to="/transfer-record">转账记录</Link>
                            <Link to="/user-center">用户中心</Link>
                        </div>
                    </div>
                </nav>

                <div className="page-container">
                    <div className="card">
                        <h2>转账记录</h2>
                        <p>加载中...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <nav className="nav-bar">
                <div className="nav-container">
                    <h2>MyHabit App</h2>
                    <div className="nav-links">
                        <Link to="/home">首页</Link>
                        <Link to="/my-habits">我的习惯</Link>
                        <Link to="/checkin">打卡</Link>
                        <Link to="/transfer-record">转账记录</Link>
                        <Link to="/user-center">用户中心</Link>
                    </div>
                </div>
            </nav>

            <div className="page-container">
                <div className="card">
                    <h2>转账记录</h2>

                    {transferLogs.length === 0 ? (
                        <p>暂无转账记录</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {transferLogs.map((log, index) => (
                                <div
                                    key={log._id || index}
                                    style={{
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ color: '#333', flex: 1 }}>
                                            <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
                                                {formatDate(log.date)}
                                            </div>
                                            <div style={{ fontSize: '1rem', opacity: 0.8 }}>
                                                Receiver: {log.receiver || 'Unknown'}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <div style={{
                                                background: getTransferTypeColor(log.type === 'friend' ? 'outgoing' : 'outgoing'),
                                                color: 'white',
                                                padding: '5px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {getTransferTypeText(log.type === 'friend' ? 'outgoing' : 'outgoing')}
                                            </div>
                                            <div style={{
                                                background: getStatusColor(log.status === 'success' ? 'completed' : log.status),
                                                color: 'white',
                                                padding: '5px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {getStatusText(log.status === 'success' ? 'completed' : log.status)}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        color: '#333',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        padding: '10px',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef',
                                        textAlign: 'right'
                                    }}>
                                        ${log.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TransferRecordPage; 