import React, { useState } from 'react';
import StripePaymentModal from './StripePaymentModal';

function PaymentModal({ isOpen, onClose, amount, type = 'platform', recipientContact = '' }) {
    const [showStripeModal, setShowStripeModal] = useState(false);

    const handlePaymentSuccess = (paymentIntent) => {
        console.log('Payment successful:', paymentIntent);
        onClose();
        // 这里可以添加成功后的处理逻辑
    };

    const handleMockPayment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/mock-payment/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: amount,
                    type: type,
                    recipientContact: recipientContact,
                    day: new Date().getDate()
                })
            });

            if (response.ok) {
                console.log('Mock payment successful');
                onClose();
            } else {
                console.error('Mock payment failed');
            }
        } catch (error) {
            console.error('Error processing mock payment:', error);
        }
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
                    maxWidth: '400px',
                    width: '90%',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginBottom: '20px', color: '#333' }}>
                        {type === 'platform' ? '平台支付' : '朋友转账'}
                    </h3>

                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                            金额: <strong>${amount}</strong>
                        </p>
                        {recipientContact && (
                            <p style={{ color: '#666' }}>
                                接收方: {recipientContact}
                            </p>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <button
                            onClick={() => setShowStripeModal(true)}
                            style={{
                                padding: '12px 20px',
                                backgroundColor: '#6772e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            真实支付 (Stripe)
                        </button>

                        <button
                            onClick={handleMockPayment}
                            style={{
                                padding: '12px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            模拟支付 (测试)
                        </button>

                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 20px',
                                backgroundColor: '#fff',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>

            <StripePaymentModal
                isOpen={showStripeModal}
                onClose={() => setShowStripeModal(false)}
                amount={amount}
                onSuccess={handlePaymentSuccess}
                type={type}
                recipientContact={recipientContact}
            />
        </>
    );
}

export default PaymentModal; 