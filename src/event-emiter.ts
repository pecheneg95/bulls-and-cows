import { EventEmitter } from 'events';

import { io } from 'app';

const eventEmitter = new EventEmitter();

eventEmitter.on('new-game', (opponentId, creatorId) => {
  io.sockets.to(`user-${opponentId}`).emit('invite', creatorId);
});

export default eventEmitter;
