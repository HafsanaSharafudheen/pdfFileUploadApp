
import express from 'express';
import { allFiles, uploadPdf,deleteFile,updateFile} from '../controllers/pdfUploadController';
import upload from '../middileware/multer';
const router = express.Router();
router.post('/', upload.single('file'),uploadPdf)
router.get('/yourFiles',allFiles)
router.post('/updateFile',upload.single('file'),updateFile)
router.delete('/deleteFile', deleteFile);
export default router;
