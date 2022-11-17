CREATE TYPE USER_ROLE AS ENUM ('user', 'admin');

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role USER_ROLE NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE GAME_STATUS AS ENUM ('created', 'playing', 'finished');

CREATE TABLE games (
  id SERIAL NOT NULL PRIMARY KEY,
  creatorId int NOT NULL,
  opponentId int NOT NULL,
  status GAME_STATUS NOT NULL,
  winnerId int,
  hiddenByCreator TEXT,
  hiddenByOpponent TEXT,
  hiddenLength int NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (creatorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (opponentId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (winnerId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE steps (
  id SERIAL NOT NULL PRIMARY KEY,
  userId int NOT NULL,
  gameId int NOT NULL,
  sequence int NOT NULL,
  value TEXT NOT NULL,
  bulls int NOT NULL,
  cows int NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE
);
