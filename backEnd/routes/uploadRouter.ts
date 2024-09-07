
import express from 'express';
import { allFiles, uploadPdf,deleteFile} from '../controllers/pdfUploadController';
import upload from '../middileware/multer';
const router = express.Router();
router.post('/', upload.single('file'),uploadPdf)
router.get('/yourFiles',allFiles)

router.delete('/deleteFile', deleteFile);
export default router;
