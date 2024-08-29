import React, { useState } from 'react';
import ImagePreview from './imagePreview';
function FormComponent() {
    const [pdfPreview, setPdfPreview] = useState(null);
    const [pdfError, setPdfError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                const fileUrl = URL.createObjectURL(selectedFile);
                setPdfPreview(fileUrl);
                setPdfError('');
            } else {
                setPdfPreview(null);
                setPdfError('Please select a valid PDF file');
            }
        } else {
            setPdfPreview(null);
            setPdfError('Please select a file');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted');
    };

    return (
        <>
            <h1>Upload a PDF file</h1>
            <form className='form-group' onSubmit={handleSubmit}>
                <input
                    type="file"
                    className='form-control'
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                {pdfError && <div className='error-msg'>{pdfError}</div>}
                <br />
                <button type="submit" className='btn btn-success btn-lg'>
                    UPLOAD
                </button>
            </form>
            <ImagePreview pdfPreview={pdfPreview} />
        </>
    );
}

export default FormComponent;
