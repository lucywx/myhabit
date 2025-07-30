import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TokenManager from './utils/tokenManager';
import HomePage from './HomePage';
import AuthRedirect from './AuthRedirect';
import SetGoalPage from './SetGoalPage';
import SetPricePage from './SetPricePage';
import SetBankPage from './SetBankPage';
import CheckinPage from './CheckinPage';
import UserCenter from './UserCenter';
import MyHabitsPopup from './MyHabitsPopup';
import InviteFriendModal from './InviteFriendModal';
import PaymentModal from './PaymentModal';
import SettingsPopup from './SettingsPopup';
import UserAccountPopup from './UserAccountPopup';
import TransferRecordsPopup from './TransferRecordsPopup';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [showMyHabitsPopup, setShowMyHabitsPopup] = useState(false);
    const [showInviteFriendModal, setShowInviteFriendModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const [showUserAccountPopup, setShowUserAccountPopup] = useState(false);
    const [showTransferRecordsPopup, setShowTransferRecordsPopup] = useState(false);

    useEffect(() => {
        // 检查本地存储的认证信息
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogin = async (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));

        // 登录后会自动重定向到根路径，然后AuthRedirect组件会处理跳转
        window.location.href = '/';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('redirected');
        setIsAuthenticated(false);
        setUser(null);
    };

    // 弹窗控制函数
    const openMyHabitsPopup = () => setShowMyHabitsPopup(true);
    const closeMyHabitsPopup = () => setShowMyHabitsPopup(false);
    const openInviteFriendModal = () => setShowInviteFriendModal(true);
    const closeInviteFriendModal = () => setShowInviteFriendModal(false);
    const openPaymentModal = (amount, type, recipientContact) => {
        setShowPaymentModal(true);
        // 这里可以设置支付相关的状态
    };
    const closePaymentModal = () => setShowPaymentModal(false);
    const openSettingsPopup = () => setShowSettingsPopup(true);
    const closeSettingsPopup = () => setShowSettingsPopup(false);
    const openUserAccountPopup = () => setShowUserAccountPopup(true);
    const closeUserAccountPopup = () => setShowUserAccountPopup(false);
    const openTransferRecordsPopup = () => setShowTransferRecordsPopup(true);
    const closeTransferRecordsPopup = () => setShowTransferRecordsPopup(false);

    return (
        <Router>
            <div className="App">
                <Routes>

                    <Route
                        path="/goal"
                        element={
                            isAuthenticated ? (
                                <SetGoalPage user={user} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/set-price"
                        element={
                            isAuthenticated ? (
                                <SetPricePage user={user} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/set-bank"
                        element={
                            isAuthenticated ? (
                                <SetBankPage user={user} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/checkin"
                        element={
                            isAuthenticated ? (
                                <CheckinPage user={user} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/user-center"
                        element={
                            isAuthenticated ? (
                                <UserCenter
                                    user={user}
                                    onLogout={handleLogout}
                                    onOpenMyHabits={openMyHabitsPopup}
                                    onOpenTransferRecords={openTransferRecordsPopup}
                                    onOpenInviteFriend={openInviteFriendModal}
                                    onOpenSettings={openSettingsPopup}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <AuthRedirect user={user} />
                            ) : (
                                <HomePage onLogin={handleLogin} />
                            )
                        }
                    />
                </Routes>

                {/* 弹窗组件 */}
                <MyHabitsPopup
                    isOpen={showMyHabitsPopup}
                    onClose={closeMyHabitsPopup}
                    user={user}
                />
                <InviteFriendModal
                    isOpen={showInviteFriendModal}
                    onClose={closeInviteFriendModal}
                />
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={closePaymentModal}
                    amount={10}
                    type="platform"
                    recipientContact=""
                />
                <SettingsPopup
                    isOpen={showSettingsPopup}
                    onClose={closeSettingsPopup}
                    user={user}
                />
                <UserAccountPopup
                    isOpen={showUserAccountPopup}
                    onClose={closeUserAccountPopup}
                    user={user}
                />
                <TransferRecordsPopup
                    isOpen={showTransferRecordsPopup}
                    onClose={closeTransferRecordsPopup}
                />
            </div>
        </Router>
    );
}

export default App; 