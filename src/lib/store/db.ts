import PouchDB from 'pouchdb';
import { Transaction, AuditFlag } from '../types';

export interface AuditSession {
    _id: string; // Audit ID (UUID)
    clientName: string;
    createdAt: string;
    updatedAt: string;
    transactions: Transaction[];
    flags: AuditFlag[];
    status: 'DRAFT' | 'REVIEWED' | 'FINAL';
}

const db = new PouchDB<AuditSession>('lexmetric_audits');

export const saveAudit = async (audit: AuditSession): Promise<void> => {
    try {
        const existing = await getAudit(audit._id);
        if (existing) {
            // Update
            await db.put({
                ...audit,
                _rev: existing._rev,
                updatedAt: new Date().toISOString()
            });
        } else {
            // Create new (shouldn't happen with get check but safety)
            await db.put(audit);
        }
    } catch (err: any) {
        if (err.status === 404) {
            // Create fresh
            await db.put(audit);
        } else {
            console.error("DB Save Error", err);
            throw err;
        }
    }
};

export const getAudit = async (id: string): Promise<AuditSession & { _rev: string } | null> => {
    try {
        return await db.get(id);
    } catch (err: any) {
        if (err.status === 404) return null;
        throw err;
    }
};

export const getAllAudits = async (): Promise<AuditSession[]> => {
    const result = await db.allDocs({ include_docs: true, descending: true });
    return result.rows.map(row => row.doc as AuditSession);
};
