import * as express from 'express';

import * as cors from 'cors';

import { mountRouter as mountAuthRouter } from '@auth';
import { mountRouter as mountUsersRouter } from '@users';
import { mountRouter as mountGamesRouter } from '@games';

import { logRequest, processError, processNotFoundEndpoint } from '@middleware';

const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(logRequest);

mountAuthRouter(expressApp);
mountUsersRouter(expressApp);
mountGamesRouter(expressApp);

expressApp.use(processNotFoundEndpoint);
expressApp.use(processError);

export default expressApp;
