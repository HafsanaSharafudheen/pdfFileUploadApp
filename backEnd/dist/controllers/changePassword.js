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
exports.changePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = bcryptjs_1.default.compareSync(oldPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }
        const hashedNewPassword = bcryptjs_1.default.hashSync(newPassword, 10);
        user.password = hashedNewPassword;
        yield user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred while changing the password" });
    }
});
exports.changePassword = changePassword;
