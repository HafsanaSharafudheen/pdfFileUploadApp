import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ImagePreviewProps {
    pdfPreview: string | null;
    setSelectedPages: React.Dispatch<React.SetStateAction<Set<number>>>;
}

function ImagePreview({ pdfPreview, setSelectedPages }: ImagePreviewProps): React.JSX.Element {
    const [numPages, setNumPages] = useState<number | null>(null);//total number of pages in the PDF
    const [viewPage, setViewPage] = useState<number | null>(null);//current page in larger size
//once the document is loaded set the total number of pages
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handlePageSelection = (pageNumber: number) => {
        
        setSelectedPages(prev => {
            //create a set to add the selected pages so that it is unique
            const newSelection = new Set(prev);
            if (newSelection.has(pageNumber)) {
                   // If the page is already selected, remove it
                newSelection.delete(pageNumber);
            } else {
                  // If the page is not selected, add it
                newSelection.add(pageNumber);
            }
            return newSelection;
        });
    };
//function call in small inage to view large siwe image
    const handlePageClick = (pageNumber: number) => {
        //set the page number to view
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
                            {/* render all the samll images  array.from creates an array of pagenumbers from the total page numbers */}
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
                                            pageNumber={index + 1}  // Page number to display
                                            width={100}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Document>
                    </div>

                    {/* for larger image view */}
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
