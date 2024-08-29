import React from 'react';

function ImagePreview({ pdfPreview }) { 
    return (
        <div className='container'>
            <br />
            <h4>View PDF</h4>
            <div className='pdfContainer'>
                {pdfPreview ? (
                    <embed
                        src={pdfPreview}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                        style={{ border: '1px solid #ddd' }}
                    />
                ) : (
                    <p>No PDF file chosen</p>
                )}
            </div>
        </div>
    );
}

export default ImagePreview;
