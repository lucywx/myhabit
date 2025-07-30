import React, { useState, useEffect } from 'react';

function TransferRecordsPopup({ isOpen, onClose }) {
    const [transferLogs, setTransferLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadTransferLogs();
        }
    }, [isOpen]);

    const loadTransferLogs = async () => {
        try {
            const token = localStorage.getItem('token');
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
    };

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
            case 'requires_action':
                return '处理中';
            case 'failed':
                return '失败';
            default:
                return '未知';
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
                maxWidth: '600px',
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
                    <h3 style={{ margin: 0, color: '#333' }}>转账记录</h3>
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

                {loading ? (
                    <p>加载中...</p>
                ) : transferLogs.length === 0 ? (
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
                                            接收方: {log.receiver || 'Unknown'}
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

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
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
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransferRecordsPopup; 