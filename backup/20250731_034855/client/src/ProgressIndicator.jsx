import React from 'react';
import './ProgressIndicator.css';

function ProgressIndicator({ currentStep, completedSteps }) {
    const steps = [
        { key: 'goal', label: '设置目标', path: '/goal' },
        { key: 'price', label: '设置价格', path: '/set-price' },
        { key: 'bank', label: '银行信息', path: '/set-bank' },
        { key: 'checkin', label: '开始打卡', path: '/checkin' }
    ];

    return (
        <div className="progress-indicator">
            <div className="progress-steps">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.key);
                    const isCurrent = currentStep === step.key;
                    const isActive = isCompleted || isCurrent;

                    return (
                        <div key={step.key} className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                            <div className="step-number">
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <div className="step-label">{step.label}</div>
                            {index < steps.length - 1 && (
                                <div className={`step-connector ${isCompleted ? 'completed' : ''}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProgressIndicator; 