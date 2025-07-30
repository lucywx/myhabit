import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

function MyHabitsPopup({ isOpen, onClose, user }) {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadHabits();
        }
    }, [isOpen]);

    const loadHabits = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/progress/user-goals', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setHabits(data.goals || []);
            } else {
                console.error('Failed to load habits');
            }
        } catch (error) {
            console.error('Error loading habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (habitId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    goalId: habitId,
                    date: new Date().toISOString().split('T')[0]
                })
            });

            if (response.ok) {
                // 重新加载习惯数据
                loadHabits();
            } else {
                console.error('Checkin failed');
            }
        } catch (error) {
            console.error('Error during checkin:', error);
        }
    };

    const handlePayment = (habit) => {
        setSelectedHabit(habit);
        setShowPaymentModal(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN');
    };

    if (!isOpen) return null;

    return (
        <>
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
                        <h3 style={{ margin: 0, color: '#333' }}>我的习惯</h3>
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
                    ) : habits.length === 0 ? (
                        <p>暂无习惯目标，请先设置目标。</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {habits.map((habit) => (
                                <div
                                    key={habit._id}
                                    style={{
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                                                {habit.title}
                                            </h4>
                                            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                                                {habit.description}
                                            </p>
                                            <div style={{ fontSize: '14px', color: '#666' }}>
                                                <span>开始日期: {formatDate(habit.startDate)}</span>
                                                <br />
                                                <span>目标天数: {habit.targetDays}天</span>
                                                <br />
                                                <span>当前进度: {habit.currentStreak || 0}/{habit.targetDays}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginTop: '15px'
                                    }}>
                                        <button
                                            onClick={() => handleCheckin(habit._id)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            今日打卡
                                        </button>

                                        <button
                                            onClick={() => handlePayment(habit)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            支付惩罚
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                amount={selectedHabit?.penaltyAmount || 10}
                type="platform"
                recipientContact=""
            />
        </>
    );
}

export default MyHabitsPopup; 