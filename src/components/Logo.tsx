import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Icon: Forensic Lens */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="10" stroke="#0F172A" strokeWidth="2.5" />
                <path d="M22 22L28 28" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                {/* Data points inside lens */}
                <circle cx="14" cy="14" r="1.5" fill="#B45309" />
                <circle cx="17.5" cy="10.5" r="1" fill="#0D9488" />
                <circle cx="10.5" cy="17.5" r="1" fill="#0D9488" />
            </svg>

            {/* Wordmark */}
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
                LEX<span style={{ fontWeight: 400 }}>METRIC</span>
            </div>
        </div>
    );
};
