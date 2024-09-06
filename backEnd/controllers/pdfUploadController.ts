import { Request, Response, NextFunction } from 'express';
import UploadFile from '../models/uploadFileModel';

export const uploadPdf = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        console.log(req.file);
        const filePath = req.file.path;
        const cleanedPath = filePath.replace(/^dist\//, ''); // Removes 'dist/' from the start of the path
        console.log(cleanedPath, "cleanedPath");
        const newUpload = new UploadFile({
            userId: req.user.id,
            filePath: cleanedPath,
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