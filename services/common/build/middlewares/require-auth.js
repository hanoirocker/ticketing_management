"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const not_authorized_error_1 = require("../errors/not-authorized-error");
// This middleware is used to check if the user is authenticated. It checks if
// the req.currentUser object is defined. If it is not defined, it throws a
// NotAuthorizedError.
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new not_authorized_error_1.NotAuthorizedError();
    }
    next();
};
exports.requireAuth = requireAuth;
