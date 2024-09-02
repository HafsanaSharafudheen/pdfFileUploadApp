"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allFiles = exports.uploadPdf = void 0;
const uploadFileModel_1 = __importDefault(require("../models/uploadFileModel"));
const uploadPdf = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const filePath = req.file.path;
        const newUpload = new uploadFileModel_1.default({
            userId: req.user.id,
            filePath: filePath,
        });
        yield newUpload.save();
        res.status(200).send('File uploaded and path saved.');
    }
    catch (error) {
        next(error);
    }
});
exports.uploadPdf = uploadPdf;
const allFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const files = yield uploadFileModel_1.default.find({ userId: userId });
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No files found for this user.' });
        }
        res.status(200).json({
            message: 'All files are found', files: files
        });
    }
    catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.allFiles = allFiles;
