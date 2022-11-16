CREATE TYPE USER_ROLE AS ENUM ('user', 'admin');

CREATE TABLE users (
id SERIAL NOT NULL PRIMARY KEY,
username TEXT NOT NULL,
password TEXT NOT NULL,
email TEXT NOT NULL,
role USER_ROLE NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE GAME_STATUS AS ENUM ('created', 'playing', 'finished');

CREATE TABLE games (
id SERIAL NOT NULL PRIMARY KEY,
creator_id int NOT NULL,
opponent_id int NOT NULL,
status GAME_STATUS NOT NULL,
winnerId int,
hidden_by_creator TEXT,
hidden_by_opponent TEXT,
hidden_length int NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (opponent_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE steps (
id SERIAL NOT NULL PRIMARY KEY,
user_id int NOT NULL,
game_id int NOT NULL,
sequence int NOT NULL,
value TEXT NOT NULL,
bulls int NOT NULL,
cows int NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
