import { GAME_STATUS } from '@games';
import { Step } from '@steps';

type Game = {
  id: number;
  creatorId: number;
  opponentId: number;
  status: GAME_STATUS;
  winnerId: number | null;
  hiddenByCreator: string | null;
  hiddenByOpponent: string | null;
  hiddenLength: number;
  createdAt: Date;
  updatedAt: Date;
  steps: Step[];
};

type creatorGame = Omit<Game, 'hiddenByOpponent'>;

type opponentGame = Omit<Game, 'hiddenByCreator'>;

export { creatorGame, opponentGame };
