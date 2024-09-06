import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './imagePreview.css';
// The worker script (pdf.worker.min.mjs) is responsible for handling PDF processing tasks like parsing and rendering PDFs.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface UploadImagePreviewProps {
    pdfPreview: string | null;
    setTitles: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>; // Pass the setTitles function
}

function UploadImagePreview({ pdfPreview, setTitles }: UploadImagePreviewProps): React.JSX.Element {
    const [numPages, setNumPages] = useState<number | null>(null); // total number of pages in the PDF
    const [viewPage, setViewPage] = useState<number | null>(null); // current page in larger size
    const [localTitles, setLocalTitles] = useState<{ [key: number]: string }>({}); // store titles for each page
    const targetDivRef = useRef<HTMLDivElement>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handlePageClick = (pageNumber: number) => {
        if (targetDivRef.current) {
            targetDivRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setViewPage(pageNumber);
    };

    return (
        <div className="container mt-3">
            <h4 className="text-center">View PDF</h4>
            {pdfPreview ? (
                <div className="row">
                    <div className="col-md-12 col-12 thumbnail-column">
                        <Document file={pdfPreview} onLoadSuccess={onDocumentLoadSuccess}>
                            <div className="thumbnail-scroll-container">
                                {numPages && Array.from(new Array(numPages), (_, index) => (
                                    <div key={`page_${index + 1}`} className="thumbnail-container">
                                        <div
                                            onClick={() => handlePageClick(index + 1)}
                                            className="thumbnail"
                                        >
                                            <h5 className="text-center mb-2">{localTitles[index + 1] || `Page ${index + 1}`}</h5>
                                            <Page
                                                pageNumber={index + 1}
                                                width={200}
                                                height={100}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Document>
                    </div>

                    <div ref={targetDivRef} className="col-12 large-view mt-5">
                        {viewPage !== null ? (
                            <div className="border p-3">
                                <h5 className="text-center">{localTitles[viewPage] || `Page ${viewPage}`}</h5>
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

export default UploadImagePreview;
