import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function AuthRedirect({ user }) {
    const [targetPage, setTargetPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/user/get-current-page', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('🎯 用户进度检查结果:', data.currentPage);

                    let page = '/goal'; // 默认页面
                    switch (data.currentPage) {
                        case 'goal':
                            page = '/goal';
                            break;
                        case 'price':
                            page = '/set-price';
                            break;
                        case 'bank':
                            page = '/set-bank';
                            break;
                        case 'checkin':
                            page = '/checkin';
                            break;
                        default:
                            page = '/goal';
                    }

                    setTargetPage(page);
                } else {
                    setTargetPage('/goal');
                }
            } catch (error) {
                console.error('检查用户进度失败:', error);
                setTargetPage('/goal');
            } finally {
                setLoading(false);
            }
        };

        checkUserProgress();
    }, [user]);

    if (loading) {
        return <div>加载中...</div>;
    }

    return <Navigate to={targetPage} replace />;
}

export default AuthRedirect; 