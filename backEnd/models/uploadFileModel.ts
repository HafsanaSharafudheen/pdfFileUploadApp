import mongoose from 'mongoose';

const UploadFileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    titles: [{
        pageNumber: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        }
    }],
}, { timestamps: true });

const UploadFile = mongoose.model('UploadFile', UploadFileSchema);

export default UploadFile;
