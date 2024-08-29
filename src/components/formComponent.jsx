import React, { useState } from 'react';
import ImagePreview from './imagePreview';

function FormComponent() {
    const [pdfPreviews, setPdfPreviews] = useState([]);
    const [pdfError, setPdfError] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');

        if (pdfFiles.length > 0) {
            const fileUrls = pdfFiles.map(file => URL.createObjectURL(file));
            setPdfPreviews(fileUrls);
            setPdfError('');
        } else {
            setPdfPreviews([]);
            setPdfError('Please select valid PDF files');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted');
    };

    return (
        <>
            <h1>Upload PDF files</h1>
            <form className='form-group' onSubmit={handleSubmit}>
                <input
                    type="file"
                    className='form-control'
                    accept="application/pdf"
                    onChange={handleFileChange}
                    multiple
                />
                {pdfError && <div style={{ color: 'red' }}>{pdfError}</div>}
                <br />
                <button type="submit" className='btn btn-success btn-lg'>
                    UPLOAD
                </button>
            </form>
            <ImagePreview pdfPreviews={pdfPreviews} />
        </>
    );
}

export default FormComponent;
