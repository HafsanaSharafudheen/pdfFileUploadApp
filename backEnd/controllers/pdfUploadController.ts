import { Request, Response, NextFunction } from 'express';
import UploadFile from '../models/uploadFileModel';
const { ObjectId } = require('mongodb');

export const uploadPdf = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        console.log(req.file);
        const filePath = req.file.path;
        const cleanedPath = filePath.replace(/^dist\//, ''); // Removes 'dist/' from the start of the path
        console.log(cleanedPath, "cleanedPath");

        const titles: { pageNumber: number, title: string }[] = [];

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('title_page_')) {
                const pageNumber = Number(key.replace('title_page_', ''));
                const title = req.body[key];
                titles.push({ pageNumber, title });
            }
        });
        const newUpload = new UploadFile({
            userId: req.user.id,
            filePath: cleanedPath,
            titles:titles
        });

        await newUpload.save();

        res.status(200).send('File uploaded and path saved.');
    } catch (error) {
        next(error); 
    }
};


export const allFiles = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const files = await UploadFile.find({ userId: userId }); 
        
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No files found for this user.' });
        }

        res.status(200).json({
            message: 'All files are found',files: files }); 
       } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const deleteFile=async(req: any, res: Response, next:NextFunction)=>{
    const { fileId } = req.query;
    const objectId = new ObjectId(fileId);

    console.log(fileId,"fileid")
    console.log(objectId,"objectId");
    try {
        const file = await UploadFile.findOneAndUpdate(
            { _id: objectId },
            { $set: { isDeleted: true } }, 
        );
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Error deleting file' });
    }
}


export const updateFile = async (req: Request, res: Response, next: NextFunction) => {
    // Extract file information
    const file = req.file; // Assuming you use multer for file uploads
    const { fileId, titles } = req.body;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = file.path; // File path from multer

    try {
        const updatedFile = await UploadFile.findOneAndUpdate(
            { _id: fileId },
            {
                $set: {
                    filePath: filePath,
                    titles: Object.keys(titles).map((pageNumber) => ({
                        pageNumber: parseInt(pageNumber),
                        title: titles[pageNumber],
                    })),
                },
            },
            { new: true }
        );

        if (!updatedFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.status(200).json({ message: 'File updated successfully', file: updatedFile });
    } catch (error) {
        res.status(500).json({ message: 'Error updating file', error });
    }
}