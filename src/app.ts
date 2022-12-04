import express from 'express';

import { mountRouter as mountAuthRouter } from './auth/auth.router';
import { mountRouter as mountUsersRouter } from './users/users.router';
import { mountRouter as mountGamesRouter } from './games/games.router';

const app = express();

app.use(express.json());

mountAuthRouter(app);
mountUsersRouter(app);
mountGamesRouter(app);

async function init(): Promise<void> {
  try {
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
