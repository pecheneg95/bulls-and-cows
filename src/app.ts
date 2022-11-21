import express from 'express';

import { mountRouter as mountAuthRouter } from './auth/auth.router';
import { mountRouter as mountUesrsRouter } from './users/users.router';
import { mountRouter as mountGamesRouter } from './games/games.router';
import { mountRouter as mountLeaderboaedRouter } from './leaderboard/leaderboard.router';
import { AppDataSource } from './data-source';
import { logRequest, processError, processNotFoundEndpoint } from '@middleware';

const app = express();

app.use(express.json());

app.use(logRequest);

mountAuthRouter(app);
mountUesrsRouter(app);
mountGamesRouter(app);
mountLeaderboaedRouter(app);

app.use(processNotFoundEndpoint);
app.use(processError);

async function init(): Promise<void> {
  try {
    AppDataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
