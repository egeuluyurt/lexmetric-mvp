import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface FileDropZoneProps {
    onFilesAccepted: (files: File[]) => void;
    isProcessing?: boolean;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesAccepted, isProcessing = false }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFilesAccepted(acceptedFiles);
        }
    }, [onFilesAccepted]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        disabled: isProcessing,
        multiple: true
    });

    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '48px',
                textAlign: 'center',
                backgroundColor: isDragActive ? '#e0f2fe' : '#f8fafc',
                borderColor: isDragActive ? '#0284c7' : (isDragReject ? '#ef4444' : '#cbd5e1'),
                cursor: isProcessing ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            <input {...getInputProps()} />

            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '24px',
                backgroundColor: isDragReject ? '#fee2e2' : '#e0f2fe',
                color: isDragReject ? '#ef4444' : '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
            }}>
                {isDragReject ? <AlertCircle size={24} /> : <UploadCloud size={24} />}
            </div>

            <h3 style={{ fontSize: '1.125rem', marginBottom: '8px', color: '#0f172a' }}>
                {isDragActive
                    ? "Drop the statements here..."
                    : "Drag & drop bank statements"}
            </h3>

            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.875rem' }}>
                {isDragReject
                    ? "Only PDF files are accepted."
                    : "PDF format only. Files are processed locally."}
            </p>

            <Button variant="primary" isLoading={isProcessing}>
                Select Files
            </Button>
        </div>
    );
};
