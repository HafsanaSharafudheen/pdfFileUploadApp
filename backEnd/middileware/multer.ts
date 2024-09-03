import multer from 'multer';
import path from 'path';
const uploadsPath = path.resolve(__dirname, '..', 'uploads');
console.log(uploadsPath,"uploadsPath");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

export default upload;
