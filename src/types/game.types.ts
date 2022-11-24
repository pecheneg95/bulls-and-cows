import { Game } from '@games';

type GameForCreator = Omit<Game, 'hiddenByOpponent'>;

type GameForOpponent = Omit<Game, 'hiddenByCreator'>;

export { GameForCreator, GameForOpponent };
