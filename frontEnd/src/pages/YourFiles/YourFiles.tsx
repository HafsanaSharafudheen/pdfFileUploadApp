import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import axios from '../../axios/axios';
import { FaTrash } from 'react-icons/fa';
import UploadImagePreview from '../../components/uploadImagePreview';
import Swal from 'sweetalert2';

function YourFiles() {
    const [tableData, setTableData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<{ filePath: string, titles: { [key: number]: string },fileId:string } | null>(null);
    const [titles, setTitles] = useState<{ [key: number]: string }>({});
    const uploadUrl =(process.env.REACT_APP_ENV=='prod'? process.env.REACT_APP_uploadUrl:process.env.REACT_APP_uploadUrlDev) + '/';

    useEffect(() => {
        fetchFiles();
    }, []);
    const fetchFiles = async () => {
        try {
            const response = await axios.get('/upload/yourFiles');
            setTableData(response.data.files);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };
    const handleFileClick = (file: any, e: any): void => {
        e.preventDefault();
        if (!file.titles || !Array.isArray(file.titles)) {
            console.error('Titles are undefined or not an array');
            return;
        }
        const titlesObject = file.titles.reduce((acc: { [key: number]: string }, title: any) => {
            acc[title.pageNumber] = title.title;
            return acc;
        }, {});
        setSelectedFile({ filePath: file.filePath, titles: titlesObject,fileId:file._id});
        setTitles(titlesObject);
    };

    const handleDelete = async (fileId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the file.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/upload/deleteFile?fileId=${fileId}`);
                setTableData(prevData => prevData.filter(file => file._id !== fileId));
                setSelectedFile(null);
                
                Swal.fire('Deleted!', 'The file has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting file:', error);
                
                Swal.fire('Error!', 'There was an issue deleting the file.', 'error');
            }
        }
    };

    function refreshParent(): void {
        fetchFiles();
        setSelectedFile(null);


    }

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
                                    {tableData.filter((file) => !file.isDeleted) 
                                        .map((file, index) => (
                                        <tr key={index}>
                                            <td>{new Date(file.createdAt).toLocaleString()}</td>
                                            <td>
                                                <button
                                                    onClick={(e) => handleFileClick(file, e)}
                                                >
                                                    {file.title} View PDF
                                                </button>
                                            </td>
                                            <td>
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
                                fileLocation={selectedFile.filePath}
                                titles={selectedFile.titles}
                                fileId={selectedFile.fileId} 
                                refreshParent={refreshParent}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default YourFiles;
