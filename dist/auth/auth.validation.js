"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const express_validator_1 = require("express-validator");
class AuthValidation {
}
exports.AuthValidation = AuthValidation;
AuthValidation.signup = [
    (0, express_validator_1.body)('email').isString().trim().notEmpty().isEmail(),
    (0, express_validator_1.body)('password')
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 10 })
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+[!@#$%^&*()_+=]/gm),
    (0, express_validator_1.body)('username').isString().trim().isLength({ min: 5, max: 256 }),
];
AuthValidation.login = [
    (0, express_validator_1.body)('email').isString().trim().isEmail(),
    (0, express_validator_1.body)('password')
        .isString()
        .trim()
        .isLength({ min: 10 })
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+[!@#$%^&*()_+=]/gm),
];
