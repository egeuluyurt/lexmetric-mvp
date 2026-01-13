import { Transaction } from '../types';
// uuid removed


// Simple random ID generator if uuid not installed, but better to use crypto.randomUUID
const generateId = () => crypto.randomUUID();

export const parseTransactions = (text: string, filename: string, pageNumber: number): Transaction[] => {
    const lines = text.split('\n');
    const transactions: Transaction[] = [];

    // Regex to match: Date (MM/DD/YY or YYYY) ... Description ... Amount
    // Example: 01/15/2023  Venmo Transfer  -50.00
    // Note: We need to handle different spacers.
    // Regex to match dates:
    // 1. MM/DD/YYYY or MM-DD-YYYY or MM.DD.YYYY
    // 2. Jan 15, 2024 or Jan. 15 2024
    const datePattern = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Za-z]{3}\.?\s+\d{1,2},?\s+\d{4})/;
    const amountPattern = /(-?\$?[\d,]+\.\d{2})/;

    for (const line of lines) {
        // Skip empty lines or header noise
        if (line.length < 10) continue;

        const dateMatch = line.match(datePattern);
        const amountMatch = line.match(amountPattern);

        if (dateMatch && amountMatch) {
            const dateStr = dateMatch[0];
            const amountStr = amountMatch[0];

            // Description is everything else? Or just anything between date and amount?
            // Simple heuristic: Remove date and amount from line, trim rest.
            let desc = line.replace(dateStr, '').replace(amountStr, '').trim();
            // Remove extra non-alphanumeric noise at start/end if any
            desc = desc.replace(/^[\s\-\.,]+|[\s\-\.,]+$/g, '');

            if (!desc) desc = "Unknown Transaction";

            // clean amount
            const cleanAmount = parseFloat(amountStr.replace(/[$,]/g, ''));

            transactions.push({
                id: generateId(),
                date: dateStr,
                description: desc,
                amount: cleanAmount,
                sourceFile: filename,
                pageNumber: pageNumber
            });
        }
    }

    return transactions;
};
