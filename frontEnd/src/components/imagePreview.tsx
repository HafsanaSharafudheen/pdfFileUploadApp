import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import './imagePreview.css';

// Set the worker script for PDF processing
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ImagePreviewProps {
    pdfPreview: string | null;
    setSelectedPages: React.Dispatch<React.SetStateAction<Set<number>>>;
    setTitles: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
}

interface DraggablePageProps {
    pageNumber: number;
    index: number;
    movePage: (dragIndex: number, hoverIndex: number) => void;
    localTitles: { [key: number]: string };
    handleTitleChange: (pageNumber: number, title: string) => void;
    handlePageSelection: (pageNumber: number) => void;
    handlePageClick: (pageNumber: number) => void;
}

const DraggablePage: React.FC<DraggablePageProps> = ({
    pageNumber,
    index,
    movePage,
    localTitles,
    handleTitleChange,
    handlePageSelection,
    handlePageClick
}) => {
    const [, dragRef] = useDrag({
        type: 'PAGE',
        item: { index },
    });

    const [, dropRef] = useDrop({
        accept: 'PAGE',
        hover(item: { index: number }) {
            if (item.index !== index) {
                movePage(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div ref={(node) => dragRef(dropRef(node))} className="thumbnail-container">
            <input
                type="checkbox"
                id={`page_${pageNumber}`}
                onChange={() => handlePageSelection(pageNumber)}
            />
            <div
                onClick={() => handlePageClick(pageNumber)}
                className="thumbnail"
            >
                {pageNumber}
                <Page
                    pageNumber={pageNumber}
                    width={200}
                    height={100}
                />
            </div>
            <input
                type="text"
                className="form-control mt-2"
                placeholder={`Enter title for page ${pageNumber}`}
                value={localTitles[pageNumber] || ""}
                onChange={(e) => handleTitleChange(pageNumber, e.target.value)}
            />
        </div>
    );
};

function ImagePreview({ pdfPreview, setSelectedPages, setTitles }: ImagePreviewProps): React.JSX.Element {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [viewPage, setViewPage] = useState<number | null>(null);
    const [localTitles, setLocalTitles] = useState<{ [key: number]: string }>({});
    const [pages, setPages] = useState<number[]>([]);

    const targetDivRef = useRef<HTMLDivElement>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPages(Array.from({ length: numPages }, (_, i) => i + 1));
    };

    const handlePageSelection = (pageNumber: number) => {
        setSelectedPages(prev => {
            const newSelection = new Set(prev);
            newSelection.has(pageNumber) ? newSelection.delete(pageNumber) : newSelection.add(pageNumber);
            return newSelection;
        });
    };

    const handlePageClick = (pageNumber: number) => {
        targetDivRef.current?.scrollIntoView({ behavior: 'smooth' });
        setViewPage(pageNumber);
    };

    const handleTitleChange = (pageNumber: number, title: string) => {
        const updatedTitles = { ...localTitles, [pageNumber]: title };
        setLocalTitles(updatedTitles);
        setTitles(updatedTitles);
    };

    const movePage = (dragIndex: number, hoverIndex: number) => {
        const updatedPages = [...pages];
        const [movedPage] = updatedPages.splice(dragIndex, 1);
        updatedPages.splice(hoverIndex, 0, movedPage);
        setPages(updatedPages);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mt-3">
                <h4 className="text-center">View PDF</h4>
                {pdfPreview ? (
                    <div className="row">
                        <div className="col-md-12 col-12 thumbnail-column">
                            <Document file={pdfPreview} onLoadSuccess={onDocumentLoadSuccess}>
                                <div className="thumbnail-scroll-container">
                                    {pages.map((pageNumber, index) => (
                                        <DraggablePage
                                            key={`page_${pageNumber}`}
                                            pageNumber={pageNumber}
                                            index={index}
                                            movePage={movePage}
                                            localTitles={localTitles}
                                            handleTitleChange={handleTitleChange}
                                            handlePageSelection={handlePageSelection}
                                            handlePageClick={handlePageClick}
                                        />
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
        </DndProvider>
    );
}

export default ImagePreview;
