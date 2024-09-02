"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userLogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const validUser = yield userModel_1.default.findOne({ "email": email });
        if (!validUser) {
            console.log("User not found for email:", email);
            return res.status(404).json({ message: "User not found" });
        }
        if (!validUser.password) {
            console.log("Password not found for user with email:", email);
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = bcryptjs_1.default.compareSync(password, validUser.password);
        if (!validPassword) {
            console.log("Invalid password for user with email:", email);
            return res.status(401).json({ message: "Wrong credentials" });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token = jwt.sign({ id: validUser._id }, jwtSecret, { expiresIn: '1h' });
        const expiryDate = new Date(Date.now() + 3600000);
        console.log('token', token);
        console.log("expiryDate", expiryDate);
        const cookieOptions = {
            httpOnly: true,
            secure: true, // Must be true when sameSite is 'none'
            sameSite: 'none', // Allows cross-site cookies
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        console.log("cookieOptions", cookieOptions);
        console.log("Authentication successful for user with email:", email);
        res.cookie('access_token', token, cookieOptions);
        res.status(200).json({ message: "Authentication successful", user: validUser });
    }
    catch (error) {
        next(error);
    }
});
exports.userLogin = userLogin;
