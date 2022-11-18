import { GAME_STATUS } from "./games.constants";

const NewGame = {
  id: 1,
  creatorId: 1,
  opponentId: 2,
  status: GAME_STATUS.CREATED,
  winnerId: null,
  hiddenByCreator: null,
  hiddenByOpponent: null,
  hiddenLength: 4,
  createdAt: Date,
  updatedAt: Date,
  steps: [],
}

const Game = {
  id: 1,
  creatorId: 1,
  opponentId: 2,
  status: GAME_STATUS.PLAYING,
  winnerId: null,
  hiddenByCreator: 1234,
  hiddenByOpponent: 4321,
  hiddenLength: 4,
  createdAt: Date,
  updatedAt: Date,
  steps: [{ step1: 1 }, { step2: 2 }],
}

const Games = [{
  id: 1,
  creatorId: 1,
  opponentId: 2,
  status: GAME_STATUS.FINISHED,
  winnerId: 2,
  hiddenByCreator: 1234,
  hiddenLength: 4,
  createdAt: new Date,
  updatedAt: new Date,
  steps: [{ step1: 1 }, { step2: 2 }],
},
{
  id: 2,
  creatorId: 2,
  opponentId: 1,
  status: GAME_STATUS.FINISHED,
  winnerId: null,
  hiddenByOpponent: 4321,
  hiddenLength: 4,
  createdAt: new Date,
  updatedAt: new Date,
  steps: [{ step1: 1 }, { step2: 2 }]
}]

export { NewGame, Game, Games }