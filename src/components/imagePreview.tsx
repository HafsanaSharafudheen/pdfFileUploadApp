import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ImagePreviewProps {
    pdfPreview: string | null;
    setSelectedPages: React.Dispatch<React.SetStateAction<Set<number>>>;
}

function ImagePreview({ pdfPreview, setSelectedPages }: ImagePreviewProps): React.JSX.Element {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [viewPage, setViewPage] = useState<number | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handlePageSelection = (pageNumber: number) => {
        setSelectedPages(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(pageNumber)) {
                newSelection.delete(pageNumber);
            } else {
                newSelection.add(pageNumber);
            }
            return newSelection;
        });
    };

    const handlePageClick = (pageNumber: number) => {
        setViewPage(pageNumber);
    };

    return (
        <div className="container mt-3">
            <h4>View PDF</h4>
            {pdfPreview ? (
                <div className="row">
                    <div className="col-md-4">
                        <Document
                            file={pdfPreview}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            {numPages && Array.from(new Array(numPages), (_, index) => (
                                <div key={`page_${index + 1}`} className="mb-3 d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        id={`page_${index + 1}`}
                                        onChange={() => handlePageSelection(index + 1)}
                                    />
                                    <div
                                        onClick={() => handlePageClick(index + 1)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Page
                                            pageNumber={index + 1}
                                            width={100}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Document>
                    </div>
                    <div className="col-md-8">
                        {viewPage !== null ? (
                            <div className="border p-3">
                                <Document file={pdfPreview}>
                                    <Page pageNumber={viewPage} />
                                </Document>
                            </div>
                        ) : (
                            <p>Click on a page to view it larger</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>No PDF selected</p>
            )}
        </div>
    );
}

export default ImagePreview;
