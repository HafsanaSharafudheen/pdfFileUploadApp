import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import axios from '../../axios/axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ImagePreview from  '../../components/imagePreview'
import UploadImagePreview from '../../components/uploadImagePreview';

function YourFiles() {
    const [tableData, setTableData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<{ filePath: string, title: string } | null>(null);
    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
    const [titles, setTitles] = useState<{ [key: number]: string }>({});
    const uploadUrl = process.env.REACT_APP_uploadUrlDev + '/';

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/upload/yourFiles');
                setTableData(response.data.files);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    function handleFileClick(file: any, e: any): void {
        e.preventDefault();
        setSelectedFile({ filePath: file.filePath, title: file.titles.title });
    }

    const handleEdit = (fileId: string) => {
        console.log(`Edit file with ID: ${fileId}`);
    };

    const handleDelete = async (fileId: string) => {
        try {
            await axios.delete(`/upload/deleteFile/${fileId}`);
            setTableData(prevData => prevData.filter(file => file._id !== fileId));
            setSelectedFile(null);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Created At</th>
                                        <th>PDF</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((file, index) => (
                                        <tr key={index}>
                                            <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={(e) => handleFileClick(file, e)}
                                                >
                                                    {file.title} View PDF
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleEdit(file._id)}
                                                    className="btn btn-warning btn-sm mr-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file._id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PDF Preview Column */}
                    <div className="col-md-6">
                        {selectedFile && (
                            <UploadImagePreview
                                pdfPreview={uploadUrl + selectedFile.filePath}
                                setTitles={setTitles} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default YourFiles;
