import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUser {
  _id?: ObjectId;
  email: string;
  
  password: string;
  fullName?: string; 
 
  
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true },
  
  password: { type: String, required: true },
  fullName: { type: String },
 

}, 
{ timestamps: true });


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
