import { EventEmitter } from 'events';

import io from '../sockets';

const eventEmitter = new EventEmitter();

enum EVENTS {
  NEW_GAME = 'new-game',
}

eventEmitter.on(EVENTS.NEW_GAME, (opponentId, creatorId) => {
  io.sockets.to(`user-${opponentId}`).emit('invite', creatorId);
});

export { eventEmitter, EVENTS };
