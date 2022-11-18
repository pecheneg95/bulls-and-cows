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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.signUpPOST = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        console.log('Username: ', username);
        console.log('Email: ', email);
        console.log('Password: ', password);
        res.status(201).json({
            message: 'User has been created',
        });
    }
    catch (error) {
        next(error);
    }
});
AuthController.loginPOST = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log('Email: ', email);
        console.log('Password: ', password);
        res.status(200).json({
            message: 'Authentification succeeded.',
        });
    }
    catch (error) {
        next(error);
    }
});
AuthController.logoutPOST = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Logout');
        res.status(200).json({
            message: 'Logout succeeded.',
        });
    }
    catch (error) {
        next(error);
    }
});
