import React, { useState } from 'react';
import ImagePreview from './imagePreview';
import axios from '../axios/axios';
import { PDFDocument } from 'pdf-lib';
import './uploadForm.css'
function UploadForm() {
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);// to store the URL of the PDF
    const [pdfError, setPdfError] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());// to store the set of selected pages from the PDF
    const [titles, setTitles] = useState<{ [key: number]: string }>({}); // Store titles for each selected page

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile && selectedFile.type === 'application/pdf') {
            //creating a url
            const fileUrl = URL.createObjectURL(selectedFile);
            setPdfPreview(fileUrl);
            setFile(selectedFile);
            setPdfError(''); // Clear any previous error messages
        } else {
            setPdfPreview(null);
            setFile(null);
            setPdfError('Please select a valid PDF file');
        }
    };

    const createNewPDFFile = async (file:File)=>{
        try {
            // Read the PDF file
            const fileArrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileArrayBuffer);

            // Create a new PDF document
            const newPdfDoc = await PDFDocument.create();

            // Add selected pages to the new PDF document
            for (const pageNumber of selectedPages) {
                const [page] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
                newPdfDoc.addPage(page);
            }

            // Serialize the new PDF document to bytes
            const pdfBytes = await newPdfDoc.save();

            // Create a new Blob from the PDF bytes
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const newFile = new File([blob], file.name);

            return newFile;

        } catch (error) {
            console.error('Error processing or uploading file:', error);
            alert(error);
        }
    }

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }
        var newFile = await createNewPDFFile(file);
        if (!newFile) {
            alert('Error occurred during selected pages conversion');
            return;
        }
        const formData = new FormData();
        formData.append('file', newFile);
        Object.keys(titles).forEach(pageNumber => {
            formData.append(`title_page_${pageNumber}`, titles[Number(pageNumber)]);
        });

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
            <div className="upload-pdf-container">
            <h1 className="upload-title">Upload PDF File</h1>
                <form className="form-group">
                    <input 
                        type="file"
                        className="form-control file-input"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                    {pdfError && <div className="error-message">{pdfError}</div>}
                    <div className="d-flex justify-content-end mt-3">
                        <button onClick={handleUpload} type="button" className="btn btn-primary btn-lg">
                            UPLOAD
                        </button>
                    </div>
                </form>
                
                {pdfPreview && (
                    <ImagePreview
                        pdfPreview={pdfPreview}
                        setSelectedPages={setSelectedPages}
                        setTitles={setTitles}
                    />
                )}
            </div>

        </>
    );
}

export default UploadForm;
