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
    // If case is not defined as a CustomError, let's log some data
    // fot the user to know what could be wrong!
    console.log(err);
    res.status(400).send({
        errors: [{ message: 'Alternative error :(' }],
    });
};
exports.errorHandler = errorHandler;
