CREATE TYPE USER_ROLE AS ENUM ('user', 'admin');

CREATE TABLE bulls_and_cows.user (
id SERIAL NOT NULL,
username TEXT NOT NULL,
password TEXT NOT NULL,
email TEXT NOT NULL,
role bulls_and_cows.USER_ROLE NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
PRIMARY KEY (id)
);

CREATE TYPE GAME_STATUS AS ENUM ('created', 'playing', 'finished');
CREATE TYPE GAME_RESULT AS ENUM ('creator_win', 'opponent_win', 'draw');

CREATE TABLE bulls_and_cows.game (
id SERIAL NOT NULL,
creator_id int,
opponent_id int,
status bulls_and_cows.GAME_STATUS NOT NULL,
result bulls_and_cows.GAME_RESULT,
hidden_by_creator TEXT,
hidden_by_opponent TEXT,
hidden_length int NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
FOREIGN KEY (creator_id) REFERENCES bulls_and_cows.user(id) ON DELETE SET NULL,
FOREIGN KEY (opponent_id) REFERENCES bulls_and_cows.user(id) ON DELETE SET NULL,
PRIMARY KEY (id)
);

CREATE TABLE bulls_and_cows.step (
id SERIAL NOT NULL,
user_id int,
game_id int NOT NULL,
sequence int NOT NULL,
value TEXT NOT NULL,
bulls int NOT NULL,
cows int NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
PRIMARY KEY (id),
FOREIGN KEY (user_id) REFERENCES bulls_and_cows.user(id) ON DELETE SET NULL,
CONSTRAINT game FOREIGN KEY (game_id)
REFERENCES bulls_and_cows.game(id)
ON DELETE CASCADE
);
