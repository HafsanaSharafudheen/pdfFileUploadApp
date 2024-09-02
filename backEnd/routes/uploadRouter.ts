
import express from 'express';
import { allFiles, uploadPdf } from '../controllers/pdfUploadController';
import upload from '../middileware/multer';
const router = express.Router();
router.post('/', upload.single('file'),uploadPdf)
router.get('/yourFiles',allFiles)
export default router;
