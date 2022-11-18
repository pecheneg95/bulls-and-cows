"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesValidation = void 0;
const express_validator_1 = require("express-validator");
class GamesValidation {
}
exports.GamesValidation = GamesValidation;
GamesValidation.allGame = [
    (0, express_validator_1.query)('gameId').notEmpty().isInt().custom((value) => value >= 0),
    (0, express_validator_1.query)('status').isNumeric(),
    (0, express_validator_1.query)('sort').isNumeric(),
    (0, express_validator_1.query)('sort').isNumeric(),
    (0, express_validator_1.query)('offset').isNumeric(),
    (0, express_validator_1.query)('limit').isNumeric(),
    /*
    gameIds?: number[],
    status?: GAME_STATUS,
    sort[type]?: SORT_DIRECTION,
    sort[field]: GAME_SORT_BY,
    offset: number,
    limit: number,
    */
];
GamesValidation.createGame = [
    (0, express_validator_1.body)('opponentId').notEmpty().isInt().custom((value) => value >= 0)
];
GamesValidation.deleteGame = [
    (0, express_validator_1.param)('gameId').notEmpty().isInt().custom((value) => value >= 0)
];
GamesValidation.changeOpponent = [
    (0, express_validator_1.param)('gameId').notEmpty().isInt().custom((value) => value >= 0)
];
