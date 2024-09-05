import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


interface AuthenticatedRequest extends Request {
    user?: any; 
 }

export const verifyJWTToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.cookies,"requsetCookies");

    const token: string | undefined = req.cookies && req.cookies.access_token;
   
    console.log(token,"token");

    if (!token) {
        return res.status(401).json("You need to Login");
    }
    console.log(process.env.JWT_SECRET,"--------process.env.JWT_SECRET");

    jwt.verify(token, process.env.JWT_SECRET  as string, (err: jwt.VerifyErrors | null, user?: any) => {
        if (err) {
            console.log("Token is not valid");
            return res.status(403).json("Token is not valid");
        }
        console.log("Token success");
        req.user = user; 
        console.log("req.user", req.user);
        next();
    });
};
