import { Server, Socket } from 'socket.io';

import * as jwt from 'jsonwebtoken';
import { config } from '@config';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const io = new Server({ cors: { origin: '*' } });

function checkUserAndJoinRoom(client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
  if (client.handshake.query.token) {
    try {
      const secret = config.DEV.JWT_SECRET;
      const token = client.handshake.query.token as string;
      const verifiedToken = jwt.verify(token, secret) as jwt.JwtPayload & { userId: number };
      const userId = verifiedToken.userId;

      client.join(`user-${userId}`);
    } catch (error) {
      console.log(error);
      client.send(error);
    }
  }
}

io.on('connection', (client) => {
  checkUserAndJoinRoom(client);

  client.on('error', (e) => client.send(e));
});

export default io;
