import { Request } from 'express';
import { Game } from './game.entity';

import { GAME_STATUS, SORT_DIRECTION } from './games.constants';

type getAllMyGamesRequestQueryDTO = {
  userIds?: string | string[] | number[];
  status?: string | GAME_STATUS;
  sortDirection?: string | SORT_DIRECTION;
  offset: string | number;
  limit: string | number;
};

type getAllMyGamesSanitizedRequestQueryDTO = {
  userIds?: number[];
  status?: GAME_STATUS;
  sortDirection?: SORT_DIRECTION;
  offset: number;
  limit: number;
};

export type GetAllMyGamesRequest = Request<unknown, unknown, unknown, getAllMyGamesRequestQueryDTO>;
export type GetAllMyGamesSanitizedRequest = Request<unknown, unknown, unknown, getAllMyGamesSanitizedRequestQueryDTO>;

type createGameRequestBodyDTO = {
  opponentId: string | number;
};

type createGameSanitizedRequestBodyDTO = {
  opponentId: number;
};

export type CreateGameRequest = Request<unknown, unknown, createGameRequestBodyDTO, unknown>;
export type CreateGameSanitizedRequest = Request<unknown, unknown, createGameSanitizedRequestBodyDTO, unknown>;

type getGameRequestParamsDTO = {
  gameId: string | number;
};

type getGameSanitizedRequestParamsDTO = {
  gameId: number;
};

export type GetGameRequest = Request<getGameRequestParamsDTO, unknown, unknown, unknown>;
export type GetGameSanitizedRequest = Request<getGameSanitizedRequestParamsDTO, unknown, unknown, unknown>;

type changeOpponentRequestParamsDTO = {
  gameId: string | number;
};

type changeOpponentSanitizedRequestParamsDTO = {
  gameId: number;
};

type changeOpponentRequestBodyDTO = {
  opponentId: string | number;
};

type changeOpponentSanitizedRequestBodyDTO = {
  opponentId: number;
};

export type ChangeOpponentRequest = Request<
  changeOpponentRequestParamsDTO,
  unknown,
  changeOpponentRequestBodyDTO,
  unknown
>;
export type ChangeOpponentSanitizedRequest = Request<
  changeOpponentSanitizedRequestParamsDTO,
  unknown,
  changeOpponentSanitizedRequestBodyDTO,
  unknown
>;

type deleteGameRequestParamsDTO = {
  gameId: string | number;
};

type deleteGameSanitizedRequestParamsDTO = {
  gameId: number;
};

export type DeleteGameRequest = Request<deleteGameRequestParamsDTO, unknown, unknown, unknown>;
export type DeleteGameSanitizedRequest = Request<deleteGameSanitizedRequestParamsDTO, unknown, unknown, unknown>;

type setHiddenRequestParamsDTO = {
  gameId: string | number;
};

type setHiddenSanitizedRequestParamsDTO = {
  gameId: number;
};

type setHiddenRequesBodyDTO = {
  hidden: string;
};

type setHiddenSanitizedRequesBodyDTO = {
  hidden: string;
};

export type SetHiddenRequest = Request<setHiddenRequestParamsDTO, unknown, setHiddenRequesBodyDTO, unknown>;
export type SetHiddenSanitizedRequest = Request<
  setHiddenSanitizedRequestParamsDTO,
  unknown,
  setHiddenSanitizedRequesBodyDTO,
  unknown
>;

type makeStepRequestParamsDTO = {
  gameId: string | number;
};

type makeStepSanitizedRequestParamsDTO = {
  gameId: number;
};

type makeStepRequesBodyDTO = {
  stepValue: string;
};

type makeStepSanitizedRequesBodyDTO = {
  stepValue: string;
};

export type MakeStepRequest = Request<makeStepRequestParamsDTO, unknown, makeStepRequesBodyDTO, unknown>;
export type MakeStepSanitizedRequest = Request<
  makeStepSanitizedRequestParamsDTO,
  unknown,
  makeStepSanitizedRequesBodyDTO,
  unknown
>;

type changeSettingsRequestParamsDTO = {
  gameId: string | number;
};

type changeSettingsSanitizedRequestParamsDTO = {
  gameId: number;
};

type changeSettingsRequesBodyDTO = {
  hiddenLength: string | number;
};

type changeSettingsSanitizedRequesBodyDTO = {
  hiddenLength: number;
};

export type ChangeSettingsRequest = Request<
  changeSettingsRequestParamsDTO,
  unknown,
  changeSettingsRequesBodyDTO,
  unknown
>;
export type ChangeSettingsSanitizedRequest = Request<
  changeSettingsSanitizedRequestParamsDTO,
  unknown,
  changeSettingsSanitizedRequesBodyDTO,
  unknown
>;

export type GameForCreator = Omit<Game, 'hiddenByOpponent'>;

export type GameForOpponent = Omit<Game, 'hiddenByCreator'>;
