"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersValidation = void 0;
const express_validator_1 = require("express-validator");
class UsersValidation {
}
exports.UsersValidation = UsersValidation;
UsersValidation.me = [
    (0, express_validator_1.param)('userId').notEmpty().isInt().custom((value) => value >= 0)
];
