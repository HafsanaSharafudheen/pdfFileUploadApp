import React from 'react';

function ImagePreview({ pdfPreviews }) {
    return (
        <div className='container'>
            <br />
            <h4>View PDFs</h4>
            <div className='row'>
                {pdfPreviews.length > 0 ? (
                    pdfPreviews.map((pdf, index) => (
                        <div key={index} className='col-md-4 mb-3'>
                            <div className='border p-3' style={{ maxWidth: '100%', maxHeight: '400px', overflow: 'auto' }}>
                                <embed
                                    src={pdf}
                                    type="application/pdf"
                                    width="100%"
                                    height="400px"
                                    style={{ border: '1px solid #ddd' }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No PDF files chosen</p>
                )}
            </div>
        </div>
    );
}

export default ImagePreview;
