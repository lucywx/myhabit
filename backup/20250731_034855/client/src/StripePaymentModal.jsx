import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from './config';

// 加载Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// 支付表单组件
function PaymentForm({ amount, onSuccess, onCancel, type = 'platform', recipientContact = '' }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. 创建支付意图
            const createPaymentIntentResponse = await fetch('/api/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount: amount,
                    type: type,
                    recipientContact: recipientContact,
                    day: new Date().getDate()
                })
            });

            if (!createPaymentIntentResponse.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret } = await createPaymentIntentResponse.json();

            // 2. 确认支付
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (stripeError) {
                setError(stripeError.message);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // 3. 确认支付成功
                const confirmResponse = await fetch('/api/payment/confirm-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        amount: amount,
                        type: type,
                        recipientContact: recipientContact,
                        day: new Date().getDate()
                    })
                });

                if (confirmResponse.ok) {
                    onSuccess(paymentIntent);
                } else {
                    setError('Payment confirmation failed');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            padding: '20px',
            maxWidth: '400px',
            margin: '0 auto'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>
                    {type === 'platform' ? '平台支付' : '朋友转账'}
                </h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                    金额: ${amount}
                    {recipientContact && <span> | 接收方: {recipientContact}</span>}
                </p>
            </div>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                backgroundColor: '#f9f9f9'
            }}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
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

            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
            }}>
                <button
                    type="button"
                    onClick={onCancel}
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
                    disabled={!stripe || loading}
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
                    {loading ? '处理中...' : '确认支付'}
                </button>
            </div>
        </form>
    );
}

// 主支付模态框组件
export default function StripePaymentModal({
    isOpen,
    onClose,
    amount,
    onSuccess,
    type = 'platform',
    recipientContact = ''
}) {
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
                padding: '20px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    ×
                </button>

                <Elements stripe={stripePromise}>
                    <PaymentForm
                        amount={amount}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                        type={type}
                        recipientContact={recipientContact}
                    />
                </Elements>
            </div>
        </div>
    );
} 