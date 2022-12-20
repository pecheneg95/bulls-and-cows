import * as express from 'express';

import * as cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';
import * as jwt from 'jsonwebtoken';

import { mountRouter as mountAuthRouter } from '@auth';
import { mountRouter as mountUsersRouter } from '@users';
import { mountRouter as mountGamesRouter } from '@games';

import { logRequest, processError, processNotFoundEndpoint } from '@middleware';

import { AppDataSource } from './data-source';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);

mountAuthRouter(app);
mountUsersRouter(app);
mountGamesRouter(app);

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
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (client) => {
  if (client.handshake.query.token) {
    try {
      const secret = process.env.JWT_SECRET as string;
      const token = client.handshake.query.token as string;
      const verifiedToken = jwt.verify(token, secret) as jwt.JwtPayload & { userId: number };
      const userId = verifiedToken.userId;

      client.join(`user-${userId}`);
    } catch (error) {
      console.log(error);
    }
  }

  client.on('message', (m) => {
    const parsedMessage = JSON.parse(m);
    switch (parsedMessage.event) {
      case 'hello':
        client.send(JSON.stringify({ event: 'hello' }));
        break;
      default:
        client.send(new Error('Wrong query').message);
    }
  });

  client.on('error', (e) => client.send(e));
});

server.listen(8080, () => console.log('Server started on 8080'));

export { io };
