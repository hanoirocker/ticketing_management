"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware for getting the current user to be used on multiple services in our
const currentUser = (req, res, next) => {
    var _a, _b;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        return next();
    }
    // If the JWT token exists, we will decode it using the JWT_KEY
    try {
        const payload = jsonwebtoken_1.default.verify((_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt, process.env.JWT_KEY);
        // NOTE: req type definition had to be modified above to include currentUser!!
        req.currentUser = payload; // Add the payload to the request object.
    }
    catch (err) {
        res.send({ currentUser: null });
    }
    // Wheter or not the JWT token exists, we will call the next middleware
    next();
};
exports.currentUser = currentUser;
