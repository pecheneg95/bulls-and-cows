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
exports.UsersController = void 0;
const users_constants_1 = require("./users.constants");
class UsersController {
}
exports.UsersController = UsersController;
_a = UsersController;
UsersController.meGet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserDTO = {
            id: 1,
            username: "Artyom",
            email: "artyom@email.com",
            role: users_constants_1.USER_ROLE.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        res.status(200).json(UserDTO);
    }
    catch (error) {
        next(error);
    }
});
UsersController.statsGet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        console.log("UserId: ", userId);
        const StatsDTO = {
            userid: userId,
            username: "Artyom",
            gamesCount: 5,
            winsCount: 1,
            lossesCount: 3,
            drawCount: 1,
            completedGamesCount: 5,
            averageStepsCountToWin: 20,
        };
        res.status(200).json(StatsDTO);
    }
    catch (error) {
        next(error);
    }
});
