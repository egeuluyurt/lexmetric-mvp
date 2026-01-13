import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDropZone } from '@/components/ingest/FileDropZone';
import { processPDF, ExtractedPDF } from '@/lib/ocr/pdfProcessor';
import { parseTransactions } from '@/lib/analysis/parser';
import { runAnalysis } from '@/lib/analysis/rules';
import { Transaction, AuditFlag } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { FileText, Loader2, CheckCircle } from 'lucide-react';

import { saveAudit, getAudit, AuditSession } from '@/lib/store/db';
import { exportAuditReport } from '@/utils/pdfGenerator';
import { ReviewModal } from '@/components/dashboard/ReviewModal';

export const IngestView: React.FC = () => {
    const { id } = useParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedFiles, setProcessedFiles] = useState<ExtractedPDF[]>([]);
    const [processingStatus, setProcessingStatus] = useState<string>('');

    // Audit State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [flags, setFlags] = useState<AuditFlag[]>([]);
    const [auditId, setAuditId] = useState(() => id || crypto.randomUUID());

    // Load audit on mount if ID generic
    useEffect(() => {
        if (!id) {
            // Reset if navigating to "New" (handled by key change in App.tsx ideally, but safety)
            setTransactions([]);
            setFlags([]);
            setAuditId(crypto.randomUUID());
            return;
        }

        const load = async () => {
            const audit = await getAudit(id);
            if (audit) {
                setTransactions(audit.transactions);
                setFlags(audit.flags);
                setAuditId(audit._id);
            }
        };
        load();
    }, [id]);

    // Review State
    const [reviewFlag, setReviewFlag] = useState<AuditFlag | null>(null);
    const [reviewTx, setReviewTx] = useState<Transaction | null>(null);

    const handleReviewClick = (flag: AuditFlag, tx: Transaction) => {
        setReviewFlag(flag);
        setReviewTx(tx);
    };

    const handleSaveReview = (flagId: string, status: AuditFlag['status'], notes: string) => {
        const updatedFlags = flags.map(f => {
            if (f.id === flagId) {
                return { ...f, status, notes };
            }
            return f;
        });
        setFlags(updatedFlags);
        setReviewFlag(null);
        setReviewTx(null);
    };

    const handleExportPDF = () => {
        const session: AuditSession = {
            _id: auditId,
            clientName: "Untitled Client",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            transactions,
            flags,
            status: 'DRAFT'
        };
        exportAuditReport(session);
    };

    const handleLoadDemoData = () => {
        setIsProcessing(true);
        setProcessingStatus('Loading forensic demo set...');

        setTimeout(() => {
            const demoTxs: Transaction[] = [
                { id: crypto.randomUUID(), date: '01/15/2025', description: 'VENMO PAYMENT TO @JOHNNY-B-GOOD', amount: -150.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '02/15/2025', description: 'VENMO PAYMENT TO @JOHNNY-B-GOOD', amount: -150.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '03/15/2025', description: 'VENMO PAYMENT TO @JOHNNY-B-GOOD', amount: -150.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '04/15/2025', description: 'VENMO PAYMENT TO @JOHNNY-B-GOOD', amount: -150.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '05/01/2025', description: 'ATM WITHDRAWAL - MAIN ST BRANCH', amount: -490.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '05/03/2025', description: 'ATM WITHDRAWAL - MAIN ST BRANCH', amount: -490.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '05/10/2025', description: 'CASH WITHDRAWAL TELLER #4', amount: -400.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '06/12/2025', description: "ST. MARY'S CHURCH DONATION", amount: -100.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '07/01/2025', description: 'CHECK #104 SUSAN MILLER', amount: -2000.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '08/01/2025', description: 'CHECK #105 SUSAN MILLER', amount: -2000.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
                { id: crypto.randomUUID(), date: '10/05/2025', description: 'ONLINE TRANSFER TO ACCT ...x9999', amount: -15000.00, sourceFile: 'DEMO_DATA', pageNumber: 1 },
            ];

            setTransactions(demoTxs);
            const newFlags = runAnalysis(demoTxs);
            setFlags(newFlags);
            setIsProcessing(false);
            setProcessingStatus('');
        }, 500);
    };

    const handleFilesAccepted = async (files: File[]) => {
        setIsProcessing(true);
        setProcessingStatus('Initializing local OCR engine...');

        const newFiles: ExtractedPDF[] = [];
        const newTransactions: Transaction[] = [];

        try {
            for (const file of files) {
                setProcessingStatus(`Parsing ${file.name}...`);
                const result = await processPDF(file);
                newFiles.push(result);

                result.pages.forEach(page => {
                    console.log(`Parsing page ${page.pageNumber}...`);
                    const txs = parseTransactions(page.text, result.filename, page.pageNumber);
                    newTransactions.push(...txs);
                });
            }

            setProcessedFiles(prev => [...prev, ...newFiles]);
            const allTransactions = [...transactions, ...newTransactions];
            setTransactions(allTransactions);

            setProcessingStatus('Running Smart Logic Engine...');
            const newFlags = runAnalysis(allTransactions);
            setFlags(newFlags);

        } catch (error) {
            console.error("OCR Error:", error);
            alert("Error processing files. See console.");
        } finally {
            setIsProcessing(false);
            setProcessingStatus('');
        }
    };

    // Auto-save effect
    useEffect(() => {
        if (transactions.length === 0) return;

        const session: AuditSession = {
            _id: auditId,
            clientName: "Untitled Client",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            transactions,
            flags,
            status: 'DRAFT'
        };

        const timer = setTimeout(() => {
            console.log("Auto-saving...");
            saveAudit(session).catch(err => console.error("Auto-save failed", err));
        }, 2000);

        return () => clearTimeout(timer);
    }, [transactions, flags, auditId]);

    const totalExposure = flags
        .filter(f => f.status !== 'IGNORED' && f.status !== 'SAFE') // Exclude safe/ignored
        .reduce((sum, flag) => {
            const tx = transactions.find(t => t.id === flag.transactionId);
            return sum + (tx ? Math.abs(tx.amount) : 0);
        }, 0);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 style={{ fontSize: '2rem', margin: 0 }}>New Audit</h1>
                        <Badge variant="neutral">Draft</Badge>
                    </div>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>
                        Start a new Medicaid 60-month lookback audit.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {transactions.length > 0 && (
                        <Button variant="secondary" onClick={handleExportPDF}>
                            Download PDF Report
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleLoadDemoData}>
                        Load Demo Data
                    </Button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Upload Statements">
                        <FileDropZone onFilesAccepted={handleFilesAccepted} isProcessing={isProcessing} />

                        {isProcessing && (
                            <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Loader2 className="animate-spin" color="var(--color-teal)" />
                                <span style={{ color: 'var(--color-navy)', fontWeight: 500 }}>{processingStatus}</span>
                            </div>
                        )}
                    </Card>

                    {transactions.length > 0 && (
                        <Card title="Audit Findings">
                            <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                                <div style={{
                                    padding: '16px',
                                    background: '#fff1f2',
                                    border: '1px solid #fecdd3',
                                    borderRadius: '8px',
                                    flex: 1
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: '#881337', fontWeight: 600, textTransform: 'uppercase' }}>Total Penalty Exposure</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#be123c' }}>
                                        ${totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#9f1239' }}>
                                        {flags.filter(f => f.status !== 'IGNORED' && f.status !== 'SAFE').length} Potential Gifts Flagged
                                    </div>
                                </div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                        <th style={{ padding: '12px' }}>Date</th>
                                        <th style={{ padding: '12px' }}>Description</th>
                                        <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                                        <th style={{ padding: '12px' }}>Risk</th>
                                        <th style={{ padding: '12px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flags.map(flag => {
                                        const tx = transactions.find(t => t.id === flag.transactionId);
                                        if (!tx) return null;
                                        const isIgnored = flag.status === 'IGNORED' || flag.status === 'SAFE';
                                        return (
                                            <tr key={flag.id} style={{
                                                borderBottom: '1px solid #f1f5f9',
                                                opacity: isIgnored ? 0.5 : 1,
                                                textDecoration: isIgnored ? 'line-through' : 'none'
                                            }}>
                                                <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>{tx.date}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ fontWeight: 500 }}>{tx.description}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{flag.description}</div>
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>
                                                    ${Math.abs(tx.amount).toFixed(2)}
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <Badge variant={flag.riskLevel === 'HIGH' ? 'danger' : 'warning'}>
                                                        {flag.ruleId.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <Button variant="outline" size="sm" onClick={() => handleReviewClick(flag, tx)}>Review</Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Card>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {processedFiles.length > 0 && (
                        <Card title="Processed Files">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {processedFiles.map((file, idx) => (
                                    <div key={idx} style={{
                                        padding: '12px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                            <FileText size={16} color="#64748b" />
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                <div style={{ fontWeight: 500, color: 'var(--color-navy)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.filename}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{file.pageCount} pages</div>
                                            </div>
                                        </div>
                                        <CheckCircle size={16} color="var(--color-teal)" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {reviewFlag && reviewTx && (
                <ReviewModal
                    isOpen={!!reviewFlag}
                    onClose={() => setReviewFlag(null)}
                    flag={reviewFlag}
                    transaction={reviewTx}
                    onSave={handleSaveReview}
                />
            )}
        </div>
    );
};
