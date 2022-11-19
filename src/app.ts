import express from 'express';

import { mountRouter as mountAuthRouter } from './auth/auth.router';
import { mountRouter as mountUesrsRouter } from './users/users.router';
import { mountRouter as mountGamesRouter } from './games/games.router';
import { mountRouter as mountLeaderboaedRouter } from './leaderboard/leaderboard.router';

const app = express();

app.use(express.json());

mountAuthRouter(app);
mountUesrsRouter(app);
mountGamesRouter(app);
mountLeaderboaedRouter(app);

async function init(): Promise<void> {
  try {
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
