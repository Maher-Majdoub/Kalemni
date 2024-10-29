"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncMiddleware = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex); // this calls error middleware
        }
    };
};
exports.default = asyncMiddleware;
