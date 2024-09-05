import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import axios from '../../axios/axios';

function YourFiles() {
    const [tableData, setTableData] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
const uploadUrl=process.env.REACT_APP_uploadUrlDev+'/'
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

    function handleFileClick(filePath: any, e:any ): void {
        e.preventDefault(); 
        setSelectedFile(filePath);
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((file:any, index) => (
                                        <tr key={index}>
                                            <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                   
                                                    onClick={(e) => handleFileClick(file.filePath, e)}
                                                >
                                                    View PDF
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
                            <div className="pdf-preview">
                                <iframe 
                                    src={uploadUrl+selectedFile} 
                                    width="100%" 
                                    height="600px" 
                                    title="PDF Preview"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default YourFiles;
