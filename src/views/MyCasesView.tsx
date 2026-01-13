import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getAllAudits, AuditSession } from '@/lib/store/db';
import { FileText, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyCasesView: React.FC = () => {
    const navigate = useNavigate();
    const [audits, setAudits] = useState<AuditSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAudits();
    }, []);

    const loadAudits = async () => {
        try {
            const data = await getAllAudits();
            setAudits(data);
        } catch (error) {
            console.error("Failed to load audits", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateExposure = (audit: AuditSession) => {
        // Only count flagged items that aren't ignored/safe
        // Wait, I updated types but the DB data might get complex. 
        // Helper function:
        return audit.flags
            .filter(f => f.status !== 'IGNORED' && f.status !== 'SAFE')
            .reduce((sum, flag) => {
                const tx = audit.transactions.find(t => t.id === flag.transactionId);
                return sum + (tx ? Math.abs(tx.amount) : 0);
            }, 0);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--color-navy)' }}>My Cases</h1>
                <p style={{ color: '#64748b', margin: 0 }}>Manage your ongoing Medicaid forensic audits.</p>
            </header>

            <Card title="Recent Audits">
                {loading ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Loading cases...</div>
                ) : audits.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                        <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No audits found. Start a new case from the Dashboard.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.9rem' }}>
                                <th style={{ padding: '12px' }}>Client / ID</th>
                                <th style={{ padding: '12px' }}>Last Updated</th>
                                <th style={{ padding: '12px' }}>Findings</th>
                                <th style={{ padding: '12px' }}>Total Exposure</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audits.map(audit => (
                                <tr key={audit._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 12px' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{audit.clientName || 'Untitled Client'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{audit._id.slice(0, 8)}...</div>
                                    </td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem' }}>
                                            <Calendar size={14} />
                                            {new Date(audit.updatedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <Badge variant={audit.flags.length > 0 ? 'warning' : 'neutral'}>
                                            {audit.flags.length} Flags
                                        </Badge>
                                    </td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#be123c' }}>
                                            <DollarSign size={14} />
                                            {calculateExposure(audit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            fontSize: '0.8rem',
                                            fontWeight: 500
                                        }}>
                                            {audit.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <button
                                            onClick={() => navigate(`/audit/${audit._id}`)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '8px 12px',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '6px',
                                                background: 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                color: 'var(--color-navy)'
                                            }}
                                        >
                                            Open <ArrowRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};
