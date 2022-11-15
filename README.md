# pixelplex_nodejs_course

# Project: Игра “Быки и коровы”

## API

### Types
```TypeScript
GameDTO {
  id: number,
  creatorId: number,
  opponentId: number,
  status:  GAME_STATUS,
  result: GAME_RESULT || null,
  hiddenByCreator: string || null, 
  hiddenByOpponent: string || null,
  hiddenLength: number,
  createdAt: Date,
  updatedAt: Date,
  steps: Step[],
}

StepDTO {
  id: number,
  userId: number,
  sequence: number,
  value: string, 
  bulls: number,
  cows: number,
  createdAt: Date,
}

UserDTO{
  id: number,
  username: string,
  email: string.
  role: USER_ROLE,
  createdAt: Date,
  updatedAt: Date,
}

StatsDTO {
  userid: number,
  username: string,
  gamesCount: number,
  winsCount: number,
  lossesCount: number,
  drawCount: number,
  completedGamesCount: number,
  averageStepsCountToWin: number,
}
```

### ENUMS 
```TypeScript
enum GAME_STATUS {
  CREATED = 'created',
  PLAYING = 'playing',
  FINISHED = 'finished',
}

enum GAME_RESULT {
  CREATOR_WIN = 'creator_win',
  OPPONENT_WIN = 'opponent_win',
  DRAW = 'draw',
}

enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

enum LEADERBOARD_SORT_BY {
  WINS_COUNT_ = 'wins_count',
  COMPLETED_GAMES_COUNT_ = 'completed_games_count',
  AVERAGE_STEPS_COUNT_TO_WIN = 'average_steps_count_to_win',
}
```

### Sign-up
POST api/v1/auth/sign-up
```TypeScript
Request DTO {
  username: string,
  password: string,
  email: string,
}
status {
  201 - Created;
  400 - Bad Request: 'Incorrect password format' | 'Incorrect username format' | 'Incorrect email format' | 'Email already in use';
}
```

### Login
POST api/v1/auth/login
```TypeScript
Request DTO {
  password: string,
  email: string,
}
Response DTO {
  token: string,
}
status {
  200 - OK;
  400 - Bad Request: 'Incorrect email';
  401 - Unauthorized: 'Incorrect password';
}
```

### Logout
POST api/v1/auth/logout
```TypeScript
status {
  200 - OK;
}
```

### Получить данные о себе
GET api/v1/users/me
```TypeScript
Response DTO:
{
  user: UserDTO,
}
status {
  200 - OK;
  401 - Unauthorized;
}
```

### Создать игру
POST api/v1/games
```TypeScript
Request DTO {
  opponentId: number,
}
Response DTO:
{
  game: GameDTO,
}
status {
  201 - Created;
  400 - Bad Request: 'Game with this user is already created' | 'Opponent not found';
  401 - Unauthorized;
}
```

### Отменить игру (удалить)
DELETE api/v1/games/:gameId
```TypeScript
status {
  200 - Created;
  400 - Bad Request: 'You cannot delete game after game start';
  401 - Unauthorized;
  404 - Not Found: 'Game not found'
}
```

### Изменить противника
PATCH api/v1/games/:gameId
```TypeScript
Request DTO {
  opponentId: number,
}

Response DTO {
  game: GameDTO,
}

status {
  200 - OK;
  400 - Bad Request: 'Game with this user is already created' | 'Opponent not found' | 'You cannot change opponent after game start';
  401 - Unauthorized;
}
```

### Изменить настройки игры (для admin)
PATCH api/v1/games/digits-number/:gameId
```TypeScript
Request DTO {
  hiddenLength: number,
}

status {
  200 - OK;
  400 - Bad Request: 'You cannot change rules after game start' | 'Incorrect answer length';
  401 - Unauthorized;
  403 -	Forbidden: 'Only for admin';
  404 - Not Found: 'Game not found'
}
```

### Загадать число
POST api/v1/games/:gameId/hidden
```TypeScript
Request DTO {
  hidden: string,
}

status {
  200 - OK;
  400 - Bad Request: 'You cannot change answer after game start' | 'Incorrect answer length';
  401 - Unauthorized;
  404 - Not Found: 'Game not found'
}
```

### Получить информацию об игре
GET api/v1/games/:gameId
```TypeScript
Response DTO:
{
  game: GameDTO,
}
status {
  200 - OK;
  401 - Unauthorized;
  403 -	Forbidden: 'You are not a member of this game';
  404 - Not Found: 'Game not found'
}
```

### Получить информацию о всех своих играх (с филльтрацией)
GET api/v1/users/allgames?userIds=:userIds&status=:status&sort=:sort&offset=:offset&limit=:limit
```TypeScript
  -Фильтрация
    userIds?: number[],
    status?: GAME_STATUS,

  -Соритровка
    sort[type]?: SORT_DIRECTION,
    sort[field]: 'сreationDate',

  -Пагинация
    offset: number,
    limit: number,

Response DTO:
{
  totalCount: number,
  games: GameDTO[],
}

status {
  200 - OK;
  400 - Bad Request: 'Incorrect userIds' | 'Incorrect game status' | 'Incorrect sort type' | 'Incorrect offset/limit' ;
  401 - Unauthorized;
}
```

### Получить статистику о чужих играх
GET api/v1/users/:userId/stats
```TypeScript
Response DTO:
{
  stats: StatsDTO,
}
status {
  200 - OK;
  401 - Unauthorized;
  404 - Not Found: 'User not found'
}
```

### Поcмотреть leaderboard
GET api/v1/leaderboard?sort=:sortBy&from=:date&to:=date&offset=:offset&limit=:limit
```TypeScript
  -Сортировка(критерии)
    sortBy: LEADERBOARD_SORT_BY,
    sortDirection: 'asc',

  -Промежуток
    from?: Date,
    to?: Date,

  -Пагинация
    offset: number,
    limit: number,

Response DTO:
{
  totalCount: number,
  stats: StatsDTO[],
}

status {
  200 - OK;
  400 - Bad Request: 'Incorrect sort criterion' | 'Incorrect date from/to' | 'Incorrect offset/limit' ;
  401 - Unauthorized;
}
```

### Сделать ход
POST api/v1/games/:gameId/step
```TypeScript
Request DTO {
  stepValue: string,
}
Response DTO {
  step: StepDTO,
  gameStatus: GAME_STATUS,
}

status {
  200 - OK;
  400 - Bad Request: 'You cannot make moves after the game is over' |
                     'You cannot make multiple moves' |
                     'You cannot make a move until all participants have guessed a number.' | 
                     'Incorrect answer length';
  401 - Unauthorized;
  403 -	Forbidden: 'You are not a member of this game';
  404 - Not Found: 'Game not found'
}
```
