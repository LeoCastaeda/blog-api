"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'defaultSecret';
class TokenService {
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1h' });
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // Verificamos que decoded sea un objeto (JwtPayload)
            return typeof decoded === 'object' ? decoded : null;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = new TokenService();
