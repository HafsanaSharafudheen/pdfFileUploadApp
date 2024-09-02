import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async () => {
    console.log("connectDB strted");
    try {
        const uri = "mongodb+srv://hafsanasharafudheen:p40JNtEcUWgtbhbX@cluster0.aii1ptx.mongodb.net/pdfApp";        
        const options: any = {
        };        
        await mongoose.connect(uri, options);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectDB;
