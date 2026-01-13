import { Transaction, AuditFlag } from '../types';

// Helper to group by recipient handle (for Digital Allowance)
// We'll use a simple heuristic: extract words after "Venmo" etc.
const extractRecipient = (desc: string): string | null => {
    const lower = desc.toLowerCase();
    if (lower.includes('venmo')) return lower.match(/venmo\s+([^\s]+)/)?.[1] || 'unknown-venmo';
    if (lower.includes('cashapp')) return 'cashapp-user'; // simplify
    if (lower.includes('zelle')) return 'zelle-user';
    return null;
};

export const runAnalysis = (transactions: Transaction[]): AuditFlag[] => {
    const flags: AuditFlag[] = [];

    // Pattern 1: Digital Allowance (Cumulative > $500)
    // Group by recipient
    const recipientTotals: Record<string, number> = {};
    const recipientTxPromise: Record<string, Transaction[]> = {};

    transactions.forEach(tx => {
        const desc = tx.description.toLowerCase();
        if (desc.includes('venmo') || desc.includes('cashapp') || desc.includes('zelle') || desc.includes('paypal')) {
            const recipient = extractRecipient(tx.description) || 'general-digital-wallet';
            recipientTotals[recipient] = (recipientTotals[recipient] || 0) + Math.abs(tx.amount);
            if (!recipientTxPromise[recipient]) recipientTxPromise[recipient] = [];
            recipientTxPromise[recipient].push(tx);
        }
    });

    Object.entries(recipientTotals).forEach(([recipient, total]) => {
        if (total > 500) {
            recipientTxPromise[recipient].forEach(tx => {
                flags.push({
                    id: crypto.randomUUID(),
                    transactionId: tx.id,
                    ruleId: 'DIGITAL_ALLOWANCE',
                    riskLevel: 'HIGH',
                    label: 'Potential Sanctionable Transfer',
                    description: `Cumulative transfers to ${recipient} exceed $500 ($${total.toFixed(2)})`,
                    caseworkerInsight: "Review for pattern of gifting. Request explanation.",
                    status: 'PENDING'
                });
            });
        }
    });


    // Other patterns per transaction
    transactions.forEach(tx => {
        const desc = tx.description.toLowerCase();
        const absAmount = Math.abs(tx.amount);

        // Pattern 2: The Smurf (Structuring)
        // Here we check individual high cash or frequency (Frequency hard to do in single pass without grouping by month, 
        // sticking to Amount threshold or explicit keyword for now)
        if ((desc.includes('atm') || desc.includes('cash') || desc.includes('teller')) && absAmount > 400) {
            // Check if "just under" threshold (e.g. 400-500, 900-1000) - heuristic
            // Or just flag all substantial cash
            flags.push({
                id: crypto.randomUUID(),
                transactionId: tx.id,
                ruleId: 'SMURF_CASH',
                riskLevel: 'MEDIUM',
                label: 'Structured Cash Withdrawal',
                description: `Large cash withdrawal of $${absAmount.toFixed(2)} detected.`,
                caseworkerInsight: "Unverified cash is presumed a gift. Receipts required.",
                status: 'PENDING'
            });
        }

        // Pattern 3: Tithe Trap
        if (desc.match(/church|synagogue|ministry|charity|donation|gofundme/)) {
            flags.push({
                id: crypto.randomUUID(),
                transactionId: tx.id,
                ruleId: 'TITHE_TRAP',
                riskLevel: 'HIGH',
                label: 'Sanctionable Transfer (Charity)',
                description: `Donation detected: ${tx.description}`,
                caseworkerInsight: "Strictly unallowable. Must be added to penalty divisor.",
                status: 'PENDING'
            });
        }

        // Pattern 4: Round Number Caregiver
        // Recurring is hard to check loosely, so we check "Round Number" && "Individual Name" heuristic
        // We'll skip "Individual Name" NLP check and just check Round Number > $100
        if (absAmount > 100 && absAmount % 50 === 0) {
            // Exclude known commercial entities if possible, but "Guilty until proven innocent"
            if (!desc.includes('atm') && !desc.includes('transfer')) {
                flags.push({
                    id: crypto.randomUUID(),
                    transactionId: tx.id,
                    ruleId: 'ROUND_NUMBER',
                    riskLevel: 'MEDIUM',
                    label: 'Potential Informal Care Agreement',
                    description: `Round number payment ($${absAmount}) detected.`,
                    caseworkerInsight: "Flagged as 'Round Number'. Require Contract.",
                    status: 'PENDING'
                });
            }
        }

        // Pattern 5: Ghost Asset
        // Check for "Transfer" and "Acct"
        if ((desc.includes('transfer') || desc.includes('xfer') || desc.includes('online banking')) && desc.includes('x')) {
            // This is a loose check. Ideally we cross-reference known accounts.
            // For now, we flag all "Transfer to..." as potential ghost assets if we don't have a whitelist.
            flags.push({
                id: crypto.randomUUID(),
                transactionId: tx.id,
                ruleId: 'GHOST_ASSET',
                riskLevel: 'HIGH',
                label: 'Undisclosed Asset Alert',
                description: `Transfer to potential external account: ${tx.description}`,
                caseworkerInsight: "Client transferring funds to hidden account. Denial risk.",
                status: 'PENDING'
            });
        }

    });

    return flags;
};
