import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUploadFile extends Document {
  userId: ObjectId;
  filePath: string;
  createdAt: Date;
}

const UploadFileSchema: Schema<IUploadFile> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    filePath: { type: String, required: true },
  },
  { timestamps: true }
);

const UploadFile = mongoose.model<IUploadFile>('UploadFile', UploadFileSchema);

export default UploadFile;
