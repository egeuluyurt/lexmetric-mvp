import * as pdfjsLib from 'pdfjs-dist';

// Define the worker src. In Vite, we can usually import it via URL.
// We might need to copy the worker to public/ if this fails, but ?url is standard.
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ExtractedPage {
    pageNumber: number;
    text: string;
}

export interface ExtractedPDF {
    filename: string;
    pages: ExtractedPage[];
    pageCount: number;
}

export const processPDF = async (file: File): Promise<ExtractedPDF> => {
    const arrayBuffer = await file.arrayBuffer();

    // Load the document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const doc = await loadingTask.promise;

    const pages: ExtractedPage[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();

        // Simple text extraction: join items with space (or specialized logic for table structure later)
        // For MVP, we presume linear text. Ideally we sort by y/x coordinates for tables.
        const text = textContent.items
            .map((item: any) => item.str)
            .join(' ');

        pages.push({
            pageNumber: i,
            text: text
        });
    }

    return {
        filename: file.name,
        pages,
        pageCount: doc.numPages
    };
};
