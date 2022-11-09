# pixelplex_nodejs_course

# Project: Игра “Быки и коровы”

## API

### Types
```TypeScript
Game DTO{
  id: number,
  creatorId: number,
  opponentId: number,
  status:  'created' | 'started' | 'finished'
  winnerId: number || null,
  hiddenNumberByCreator: number || null, 
  hiddenNumberByOpponent: number || null,
  hiddenNumberLength: number,
  steps: Step[],
}

Step {
  id: number,
  userId: number,
  sequence: number,
  value: number, 
}

User DTO{
  id: number,
  username: string,
  email: string.
  role: 'member' | 'admin',
}

Stats DTO {
  userid: number,
  username: string,
  countGames: number,
  countWins: number,
  countCompleted: number,
  countStepsToWin: number,
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
  user: User,
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
  game: Game,
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
  game: Game,
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
  hiddenNumber: number,
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
  game: Game,
}
status {
  200 - OK;
  401 - Unauthorized;
  403 -	Forbidden: 'You are not a member of this game';
  404 - Not Found: 'Game not found'
}
```

### Получить информацию о всех своих играх (с филльтрацией)
GET api/v1/users/allgames?filter=:filter&sort=:sort&offset=:offset&limit=:limit
```TypeScript
  -Фильтрация
    filter: 'usersId' | 'status',
      usersId: number[],
      status: 'created' | 'started' | 'finished',

  -Соритровка
    sort[type]: 'asc' | 'desc' | 'none',
    sort[field]: сreationDate,

  -Пагинация
    offset: number,
    limit: number,

Response DTO:
{
  totalCount: number,
  games: Game[],
}

status {
  200 - OK;
  400 - Bad Request: 'Incorrect filter' | 'Incorrect sort type' | 'Incorrect offset/limit' ;
  401 - Unauthorized;
}
```

### Получить статистику о чужих играх
GET api/v1/users/:userId/stats
```TypeScript
Response DTO:
{
  stats: Stats,
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
    sortBy: 'countWins' | 'countCompleted' | 'countStepsToWin',
    sortDirection: 'asc',

  -Промежуток
    from: date,
    to: date,

  -Пагинация
    offset: number,
    limit: number,

Response DTO:
{
  totalCount: number,
  stats: Stats[],
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
  stepValue: number,
}
Response DTO {
  bulls: number,
  cows: number,
  game: Game,
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
