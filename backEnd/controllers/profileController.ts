import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

export const profileDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.query; 

      
        const user = await User.findOne({ "email":email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ userDetails: user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
