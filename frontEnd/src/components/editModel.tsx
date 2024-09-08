import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { pdfjs, Document, Page } from 'react-pdf';
import axios from '../axios/axios';

interface EditModalProps {
  show: boolean;
  onHide: () => void;
  file: { filePath: string };
  pageNumber: number;
  handleSave: () => void;
  fileId: string;
}

const EditModal: React.FC<EditModalProps> = ({
  show,
  onHide,
  file,
  pageNumber,
  handleSave,
  fileId,
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null); // PDF file
  const [pdfError, setPdfError] = useState<string>(''); // Error message
  const [selectedPage, setSelectedPage] = useState<number | null>(null); // Selected page
  const [numPages, setNumPages] = useState<number | null>(null); // Number of pages
  const [pages, setPages] = useState<number[]>([]); // Pages array
  const [titles, setTitles] = useState<{ [key: number]: string }>({}); // Titles for each page

  useEffect(() => {
    if (pdfFile) {
      // Reset selected page and number of pages when file changes
      setSelectedPage(null);
      setNumPages(null);
      setPages([]);
      setTitles({});
    }
  }, [pdfFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setPdfFile(selectedFile);
      setPdfError(''); // Clear any previous error messages
    } else {
      setPdfFile(null);
      setPdfError('Please select a valid PDF file');
    }
  };

  const onDocumentLoadSuccess = (info: { numPages: number }) => {
    setNumPages(info.numPages);
    setPages(Array.from({ length: info.numPages }, (_, i) => i + 1));
  };

  const handlePageSelection = (page: number) => {
    setSelectedPage(page);
  };

  const handleTitleChange = (page: number, title: string) => {
    setTitles(prevTitles => ({ ...prevTitles, [page]: title }));
  };

  const handleSaveChanges = async () => {
    if (pdfFile) {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);

      formData.append('fileId', fileId);
      formData.append('titles', JSON.stringify(titles));

      try {
        await axios.post('/upload/updateFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        handleSave();
      } catch (error) {
        console.error('Error saving file:', error);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit PDF and Select Pages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input 
          type="file"
          className="form-control file-input"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {pdfError && <p className="text-danger">{pdfError}</p>}
        {pdfFile && (
          <div>
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {pages.map((page) => (
                <div key={page}>
                  <label>
                    <input
                      type="radio"
                      name="pageSelect"
                      checked={selectedPage === page}
                      onChange={() => handlePageSelection(page)}
                    />
                    Page {page}
                  </label>
                  <Page
                    pageNumber={page}
                    width={300}
                    onLoadError={(error) => console.error('Page Load Error:', error)}
                  />
                  {selectedPage === page && (
                    <input
                      type="text"
                      placeholder="Title for this page"
                      value={titles[page] || ''}
                      onChange={(e) => handleTitleChange(page, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </Document>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
