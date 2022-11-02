# pixelplex_nodejs_course

# Project: Игра “Быки и коровы”

## API

### Sign-up
POST api/v1/auth/sign-up
```TypeScript
Request DTO {
  username: string,
  password: string,
  email: string,
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
```
### Logout
POST api/v1/auth/logout

### Получить данные о себе
GET api/v1/users/me
```TypeScript
Response DTO:
{
  user: User,
}
```
### Изменить данные пользователя (не критичные)
PATCH api/v1/users
```TypeScript
Request DTO {
  name: string,
}
```
### Изменить email пользователя
PATCH api/v1/users/email
```TypeScript
Request DTO {
  email: string,
}
```
### Изменить пароль пользователя
PATCH api/v1/users/password
```TypeScript
Request DTO {
  password: string,
}
```
### Удалить пользователя
DELETE api/v1/users

### Создать игру
POST api/v1/games
```TypeScript
Request DTO {
  opponentId: number,
}
```
### Отменить игру (удалить)
DELETE api/v1/games/:gameId

### Изменить противника
PATCH api/v1/games/:gameId
```TypeScript
Request DTO {
  opponentId: userId,
}
```
### Получить информацию об игре
GET api/v1/games/:gameId
```TypeScript
Response DTO:
{
  game: Game,
}
```
### Сделать ход
PATCH api/v1/games/:gameId/step
```TypeScript
Request DTO {
  stepValue: number,
}
```
### Получить информацию о всех своих играх (с филльтрацией)
GET api/v1/users/allgames?filter=:filter&sort=:sort&offset=:offset&limit=:limit
```TypeScript
  -Фильтрация
    filter: 'usersId' | 'status',
      usersId: number[],
      status: boolean,

  -Соритровка
    sort[type]: 'asc' | 'desc' | 'none',
    sort[field]: сreationDate,

  -Пагинация
    offset: number,
    limit: number,

Response DTO:
{
  countGames: number,
  games: Game[],
}
```
### Получить статистику о чужих играх
GET api/v1/users/:userId/stats
```TypeScript
Response DTO:
{
  stats: Stats,
}
```
### Поcмотреть leaderboard
GET api/v1/leaderboard?sort=:criterion&from=:date&to:=date&offset=:offset&limit=:limit
```TypeScript
  -Сортировка(критерии)
    criterion: 'countWins' | 'countCompleted' | 'countStepsToWin',

  -Промежуток
    from: date,
    to: date,

  -Пагинация
    offset: number,
    limit: number,

Response DTO:
{
  countUsers: number,
  leadbord: User[],
}
```
### Посмотреть свои контакты
GET api/v1/users/contacts&offset=:offset&limit=:limit
```TypeScript
  -Пагинация
    offset: number,
    limit: number,

Response DTO:
{
  countContacts: number,
  contacts: User[],
}
```
