import React from 'react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ShieldCheck, Zap, FileText, ArrowRight, Table, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingView: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        // Simple auth simulation (navigate to dashboard)
        navigate('/dashboard');
    };

    return (
        <div style={{ fontFamily: 'var(--font-heading)', background: 'white' }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 40px', borderBottom: '1px solid #e2e8f0'
            }}>
                <Logo />
                <Button variant="outline" onClick={handleGetStarted}>Sign In</Button>
            </nav>

            {/* Hero Section */}
            <header style={{
                textAlign: 'center', padding: '100px 20px', backgroundColor: '#f8fafc',
                background: 'linear-gradient(to bottom, #f1f5f9 0%, #ffffff 100%)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 12px', background: '#dbeafe', color: '#1e40af',
                        borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px'
                    }}>
                        <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                            <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#bfdbfe', opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: '#3b82f6' }}></span>
                        </span>
                        v1.0 Public Beta
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em'
                    }}>
                        The 60-Month Medicaid Audit. <span style={{ color: 'var(--color-teal)' }}>Perfected.</span>
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.6, marginBottom: '40px' }}>
                        Stop reviewing bank statements with a highlighter. Analyze 5 years of transactions in minutes—securely on your device.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Button onClick={handleGetStarted} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                            Get Early Access <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                        </Button>
                    </div>

                    <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '40px', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={20} color="var(--color-teal)" /> Local-First Architecture
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={20} color="var(--color-teal)" /> Zero Data Retention
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={20} color="var(--color-teal)" /> Model Rule 1.6 Compliant
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem/Solution Grid */}
            <section style={{ padding: '80px 20px', background: 'white' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>

                        {/* Old Way */}
                        <div style={{ padding: '40px', background: '#fff1f2', borderRadius: '16px', border: '1px solid #fecdd3' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9f1239', marginBottom: '24px' }}>The Old Way</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <li style={{ display: 'flex', gap: '12px', alignItems: 'start', color: '#881337' }}>
                                    <span style={{ fontSize: '1.2rem' }}>❌</span> Manual Excel Data Entry
                                </li>
                                <li style={{ display: 'flex', gap: '12px', alignItems: 'start', color: '#881337' }}>
                                    <span style={{ fontSize: '1.2rem' }}>❌</span> Missed Cash Withdrawals
                                </li>
                                <li style={{ display: 'flex', gap: '12px', alignItems: 'start', color: '#881337' }}>
                                    <span style={{ fontSize: '1.2rem' }}>❌</span> Unbillable Paralegal Hours
                                </li>
                            </ul>
                        </div>

                        {/* LexMetric Way */}
                        <div style={{ padding: '40px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', position: 'relative' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#166534', marginBottom: '24px' }}>The LexMetric Way</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <li style={{ display: 'flex', gap: '12px', alignItems: 'start', color: '#14532d' }}>
                                    <FileText size={24} color="#16a34a" /> Instant OCR & Parsing
                                </li>
                                <li style={{ display: 'flex', gap: '12px', alignItems: 'start', color: '#14532d' }}>
                                    <Zap size={24} color="#16a34a" /> 'Gift' Patter Detection
                                </li>
                                <li style={{ display: 'flex', gap: '12px', alignItems: 'start', color: '#14532d' }}>
                                    <Table size={24} color="#16a34a" /> Audit-Ready PDF Reports
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            <footer style={{ padding: '40px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8' }}>
                <p>&copy; {new Date().getFullYear()} LexMetric. All rights reserved. Locally Hosted.</p>
            </footer>
        </div>
    );
};
