import React, { useCallback, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './imagePreview.css';
import { FaEdit } from 'react-icons/fa';
import EditModal from '../components/editModel';
import axios from '../axios/axios';
import Swal from 'sweetalert2';
import './uploadImagePreview.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface UploadImagePreviewProps {
    pdfPreview: string | null;
    setTitles: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    titles: { [key: number]: string };
    fileId:string|null;
}

const UploadImagePreview: React.FC<UploadImagePreviewProps> = ({ pdfPreview, setTitles,fileId, titles }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [viewPage, setViewPage] = useState<number | null>(null);
    const targetDivRef = useRef<HTMLDivElement>(null);
    const [selectedFile, setSelectedFile] = useState<{ filePath: string, titles: { [key: number]: string } } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<number | null>(null);  // For tracking the page being edited
    const [pageNumber, setPageNumber] = useState<number | null>(null);  // For tracking the page being edited
    const [pdf, setPdf] = useState<any | null>(null);  // For tracking the page being edited
    // const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    //     setNumPages(numPages);
    // };

    const onDocumentLoadSuccess = (async (pdf: any) => {
        console.log(pdf)
        //setPdf(pdf.getPage(1));
        setNumPages(pdf.numPages);                
    });

    const handleSaveChanges = async () => {
        try {
            await axios.post('/upload/updateFile', {
                filePath: selectedFile?.filePath,
                titles: titles,
            });
            Swal.fire('Success', 'File updated successfully', 'success');
            setIsModalOpen(false); // Close modal after saving
        } catch (error) {
            console.error('Error saving changes:', error);
            Swal.fire('Error', 'Failed to save changes', 'error');
        }
    };

    const handleEdit = (pageNumber: number) => {
        setPageNumber(pageNumber);
        setEditingPage(pageNumber);
        setIsModalOpen(true);
    };

    const handlePageClick = (pageNumber: number) => {
        if (targetDivRef.current) {
            targetDivRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setViewPage(pageNumber);
    };


    const handlePageClickPdf = async () =>{
        const otherPdf = await pdfjs.getDocument('http://localhost:3001/uploads/1725689478249-306926793.pdf').promise;
        setPdf(await otherPdf.getPage(1));
        console.log(otherPdf);
    }

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
                                        <div  className="thumbnail">
                                            <div className="row">
                                            <h5 className="text-center mb-2 col-8">
                                                {titles[index + 1] || `Page ${index + 1}`}                                                
                                            </h5>
                                            <button onClick={() => handleEdit(index + 1)}
                                                    className="btn btn-sm btn-warning ml-2 editbutton col-auto"
                                                >
                                                    <FaEdit />
                                                </button>
                                            </div>
                                            <div>
                                               
                                            <Page onClick={() => handlePageClick(index + 1)}
                                                pageNumber={index + 1}
                                                width={200}
                                                height={100}
                                            />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Document>
                        PDF 2
                        
                        <button onClick={() => handlePageClickPdf()} >Move 1 page to above from below</button>
                        
                    </div>

                    <div ref={targetDivRef} className="col-12 large-view mt-5">
                        {viewPage !== null ? (
                            <div className="border p-3">
                                <h5 className="text-center">
                                    {titles[viewPage] || `Page ${viewPage}`}
                                    {/* <button
                                        onClick={() => handleEdit(viewPage)}
                                        className="btn btn-sm btn-warning ml-2"
                                    >
                                        <FaEdit />
                                    </button> */}
                                </h5>
                                <Document file={pdfPreview}>
                                    <Page
                                        pageNumber={viewPage}
                                        width={800}
                                    />
                                </Document>
                            </div>
                        ) : (
                            <p className="text-center">Click on a page to view it larger</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>No PDF preview available</div>
            )}

{isModalOpen && pdfPreview && pageNumber && fileId &&(
    <EditModal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        handleSave={handleSaveChanges}
        fileId={fileId}
        file={{ filePath: pdfPreview }} 
        pageNumber={pageNumber} 
    />
)}


        </div>
    );
};

export default UploadImagePreview;
