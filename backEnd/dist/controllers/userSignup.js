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
exports.userSignup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userSignupData = req.body;
    const hashedPassword = bcryptjs_1.default.hashSync(userSignupData.password, 10);
    try {
        const existingUser = yield userModel_1.default.findOne({ email: userSignupData.email });
        if (!existingUser) {
            const newUser = new userModel_1.default({
                email: userSignupData.email,
                password: hashedPassword,
                fullName: userSignupData.fullName,
            });
            yield newUser.save();
            return res.status(201).json({ user: newUser });
        }
        else {
            return res.status(400).json({ message: "User already exists" });
        }
    }
    catch (error) {
        console.error("Error during user signup:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.userSignup = userSignup;
