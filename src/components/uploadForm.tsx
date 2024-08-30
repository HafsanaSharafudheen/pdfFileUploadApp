import React, { useState } from 'react';
import ImagePreview from './imagePreview';
import axios from '../axios/axios';

function UploadForm() {
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile && selectedFile.type === 'application/pdf') {
            const fileUrl = URL.createObjectURL(selectedFile);
            setPdfPreview(fileUrl);
            setFile(selectedFile);
            setPdfError('');
        } else {
            setPdfPreview(null);
            setFile(null);
            setPdfError('Please select a valid PDF file');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('selectedPages', JSON.stringify(Array.from(selectedPages)));

        try {
            await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    return (
        <>
            <h1>Upload PDF file</h1>
            <form className='form-group'>
                <input
                    type="file"
                    className='form-control'
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                {pdfError && <div style={{ color: 'red' }}>{pdfError}</div>}
                <br />
                <div className="d-flex justify-content-end m-4">
                    <button onClick={handleUpload} type="button" className='btn btn-primary btn-lg'>
                        UPLOAD
                    </button>
                </div>
            </form>
            {pdfPreview && (
                <ImagePreview
                    pdfPreview={pdfPreview}
                    setSelectedPages={setSelectedPages}
                />
            )}
        </>
    );
}

export default UploadForm;
