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
exports.updateFile = exports.deleteFile = exports.allFiles = exports.uploadPdf = void 0;
const uploadFileModel_1 = __importDefault(require("../models/uploadFileModel"));
const { ObjectId } = require('mongodb');
const uploadPdf = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        console.log(req.file);
        const filePath = req.file.path;
        const cleanedPath = filePath.replace(/^dist\//, ''); // Removes 'dist/' from the start of the path
        console.log(cleanedPath, "cleanedPath");
        const titles = [];
        Object.keys(req.body).forEach(key => {
            if (key.startsWith('title_page_')) {
                const pageNumber = Number(key.replace('title_page_', ''));
                const title = req.body[key];
                titles.push({ pageNumber, title });
            }
        });
        const newUpload = new uploadFileModel_1.default({
            userId: req.user.id,
            filePath: cleanedPath,
            titles: titles
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
const deleteFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId } = req.query;
    const objectId = new ObjectId(fileId);
    console.log(fileId, "fileid");
    console.log(objectId, "objectId");
    try {
        const file = yield uploadFileModel_1.default.findOneAndUpdate({ _id: objectId }, { $set: { isDeleted: true } });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json({ message: 'File deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Error deleting file' });
    }
});
exports.deleteFile = deleteFile;
const updateFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, "req.body");
    const { fileId, titles, pageNumber } = req.body;
    const objectId = new ObjectId(fileId);
    if (!objectId) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log(objectId, "field Id");
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = req.file.path;
    const cleanedPath = filePath.replace(/^dist\//, '');
    console.log(req.file, "requestfile");
    try {
        const updatedFile = yield uploadFileModel_1.default.findOneAndUpdate({ _id: objectId }, {
            $set: {
                filePath: cleanedPath,
            },
        }, { new: true });
        if (!updatedFile) {
            return res.status(404).json({ message: 'File not found' });
        }
        const result = yield uploadFileModel_1.default.updateOne({ _id: objectId, "titles.pageNumber": pageNumber }, { $set: { "titles.$.title": titles } });
        res.status(200).json({ message: 'File updated successfully', file: updatedFile });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating file', error });
    }
});
exports.updateFile = updateFile;
