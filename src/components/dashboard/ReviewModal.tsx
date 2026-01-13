import React, { useState } from 'react';
// headlessui removed

// Wait, I saw "vanilla CSS" in the plan. I should make a custom modal or use standard HTML dialog if supported, but React standard modal is safer.
// Let's stick to a simple custom overlay for now to match the "Vanilla CSS" requirement without extra deps.

import { AuditFlag, Transaction } from '@/lib/types';
import { Button } from '../ui/Button';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    flag: AuditFlag;
    transaction: Transaction;
    onSave: (flagId: string, status: AuditFlag['status'], notes: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, flag, transaction, onSave }) => {
    const [notes, setNotes] = useState(flag.notes || '');
    const [status, setStatus] = useState<AuditFlag['status']>(flag.status);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(flag.id, status, notes);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                width: '500px',
                maxWidth: '90%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ marginTop: 0, fontSize: '1.25rem', color: 'var(--color-navy)' }}>Review Transaction</h2>

                <div style={{ margin: '16px 0', padding: '12px', background: '#f8fafc', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600 }}>Date:</span>
                        <span>{transaction.date}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600 }}>Amount:</span>
                        <span style={{ fontFamily: 'monospace' }}>${Math.abs(transaction.amount).toFixed(2)}</span>
                    </div>
                    <div style={{ marginBottom: '4px', fontWeight: 600 }}>Description:</div>
                    <div style={{ fontSize: '0.9rem', color: '#334155' }}>{transaction.description}</div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Paralegal Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '8px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontFamily: 'inherit'
                        }}
                        placeholder="Enter justification or observation..."
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button
                        onClick={() => setStatus('CONFIRMED')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: status === 'CONFIRMED' ? '#ef4444' : 'white',
                            color: status === 'CONFIRMED' ? 'white' : '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Confirm as Gift
                    </button>
                    <button
                        onClick={() => setStatus('SAFE')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: status === 'SAFE' ? '#10b981' : 'white',
                            color: status === 'SAFE' ? 'white' : '#10b981',
                            border: '1px solid #10b981',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Reclassify as Safe
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Decision</Button>
                </div>
            </div>
        </div>
    );
};
