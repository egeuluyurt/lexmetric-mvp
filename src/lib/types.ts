export interface Transaction {
    id: string; // Unique ID
    date: string; // ISO Date
    description: string;
    amount: number; // Negative for debits/transfers out
    category?: string;
    sourceFile: string;
    pageNumber: number;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface AuditFlag {
    id: string;
    transactionId: string;
    ruleId: string; // e.g., 'DIGITAL_ALLOWANCE'
    riskLevel: RiskLevel;
    label: string;
    description: string;
    caseworkerInsight: string; // "Review for pattern..."
    status: 'PENDING' | 'CONFIRMED' | 'IGNORED' | 'SAFE';
    notes?: string;
}

export interface AuditSummary {
    totalAssets: number;
    totalSanctionable: number;
    penaltyPeriodMonths: number;
    divisor: number;
    lookbackStart: string;
    lookbackEnd: string;
}
