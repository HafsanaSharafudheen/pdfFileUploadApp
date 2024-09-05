import { Request, Response, NextFunction, CookieOptions } from 'express';
import User from '../models/userModel'; 
import bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password} = req.body; 
console.log(req.body,"reqqqqqqqqq")
    try {
        const validUser = await User.findOne({ "email":email });
        if (!validUser) {
            console.log("User not found for email:", email);
            return res.status(404).json({ message: "User not found" });
        }

        if (!validUser.password) {
            console.log("Password not found for user with email:", email);
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            console.log("Invalid password for user with email:", email);
            return res.status(401).json({ message: "Wrong credentials" });
        }

        const jwtSecret = process.env.JWT_SECRET;
        console.log(process.env.JWT_SECRET,"--------process.env.JWT_SECRET");
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign({ id: validUser._id }, jwtSecret, { expiresIn: '1h' }); 
        const expiryDate = new Date(Date.now() + 3600000);
        console.log('token', token);
        console.log("expiryDate", expiryDate);

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: false,        // Must be true when sameSite is 'none'
            sameSite: 'strict', //none    // Allows cross-site cookies
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        console.log("cookieOptions", cookieOptions);

        console.log("Authentication successful for user with email:", email);
        res.cookie('access_token', token, cookieOptions);
        res.status(200).json({ message: "Authentication successful", user: validUser });

    } catch (error) {
        next(error); 
    }
};
