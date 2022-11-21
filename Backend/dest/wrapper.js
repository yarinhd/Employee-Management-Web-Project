"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Wrapper {
    static wrapAsync(func) {
        return (req, res, next) => {
            func(req, res, next).catch(next);
        };
    }
}
exports.default = Wrapper;
