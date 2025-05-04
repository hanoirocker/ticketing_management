"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
// The idea of thsi middleware is to:
// - Catch every error found on requests
// - Return a solid structure for those errors
const errorHandler = (err, req, res, next) => {
    if (err instanceof custom_error_1.CustomError) {
        res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({
        errors: [{ message: 'Alternative error :(' }],
    });
};
exports.errorHandler = errorHandler;
