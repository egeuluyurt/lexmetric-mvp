import React from 'react';
import './Badge.css';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'neutral' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
    return (
        <span className={`badge badge-${variant}`}>
            {children}
        </span>
    );
};
