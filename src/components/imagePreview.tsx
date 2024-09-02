import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './imagePreview.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ImagePreviewProps {
    pdfPreview: string | null;
    setSelectedPages: React.Dispatch<React.SetStateAction<Set<number>>>;
}

function ImagePreview({ pdfPreview, setSelectedPages }: ImagePreviewProps): React.JSX.Element {
    const [numPages, setNumPages] = useState<number | null>(null);//total number of pages in the PDF
    const [viewPage, setViewPage] = useState<number | null>(null);//current page in larger size
    const targetDivRef = useRef<HTMLDivElement>(null);
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
                      <input
                        type="checkbox"
                        id={`page_${index + 1}`}
                        onChange={() => handlePageSelection(index + 1)}
                      />
                      <div
                        onClick={() => handlePageClick(index + 1)}
                        className="thumbnail"
                      >{index + 1}
                        <Page
                          pageNumber={index + 1}
                          width={200}  // Adjust width as needed
                          height={100}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Document>
            </div>
      
            <div ref={targetDivRef}  className="col-12 large-view mt-5">
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
