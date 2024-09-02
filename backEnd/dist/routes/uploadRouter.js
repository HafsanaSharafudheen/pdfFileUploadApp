"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfUploadController_1 = require("../controllers/pdfUploadController");
const multer_1 = __importDefault(require("../middileware/multer"));
const router = express_1.default.Router();
router.post('/', multer_1.default.single('file'), pdfUploadController_1.uploadPdf);
router.get('/yourFiles', pdfUploadController_1.allFiles);
exports.default = router;
