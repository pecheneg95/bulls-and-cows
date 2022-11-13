CREATE TABLE bulls_and_cows.user (
id SERIAL NOT NULL,
username TEXT NOT NULL,
password TEXT NOT NULL,
email TEXT NOT NULL,
role TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CHECK  (role='member' OR role='string'),
PRIMARY KEY (id)
);
CREATE TABLE bulls_and_cows.Game (
id SERIAL NOT NULL,
creator_id int NOT NULL,
opponent_id int NOT NULL,
status TEXT NOT NULL,
CHECK (status='created' or status='started' or status='finished'),
winner_id int,
hidden_number_by_creator int,
hidden_number_by_opponent int,
hidden_number_length int NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
FOREIGN KEY (creator_d) REFERENCES bulls_and_cows.User(id),
FOREIGN KEY (opponent_id) REFERENCES bulls_and_cows.User(id),
PRIMARY KEY (id)
);
CREATE TABLE bulls_and_cows.step (
id SERIAL NOT NULL,
user_id int NOT NULL,
game_id int NOT NULL,
sequence int NOT NULL,
value int NOT NULL,
bulls int NOT NULL,
cows int NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
PRIMARY KEY (id),
FOREIGN KEY (user_id) REFERENCES bulls_and_cows.user(id),
FOREIGN KEY (game_id) REFERENCES bulls_and_cows.game(id)
);