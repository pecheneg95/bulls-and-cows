# pixelplex_nodejs_course

### Project: Игра “Быки и коровы”

## API

# Создать пользователя
POST api/v1/users
{
  username: string,
  password: string,
  email: string,
}

DTO:
{
  status: string,
}

# Login
POST api/v1/users/login
{
  password: string,
  email: string,
}

DTO:
{
  status: string,
}

# Logout
POST api/v1/users/logout

DTO:
{
  status: string,
}

# Получить данные о себе
GET api/v1/users/me

DTO:
{
  status: string,
  user: User,
}

# Изменить данные пользователя (не критичные)
PATCH api/v1/users
{
  user: User,
}

DTO:
{
  status: string,
}

# Изменить email пользователя
PATCH api/v1/users/email
{
  email: string,
}

DTO:
{
  status: string,
}

# Изменить пароль пользователя
PATCH api/v1/users/password
{
  password: string,
}

DTO:
{
  status: string,
}

# Удалить пользователя
DELETE api/v1/users

DTO:
{
  status: string,
}

# Создать игру
POST api/v1/games

DTO:
{
  status: string,
}

# Отменить игру (удалить)
DELETE api/v1/games/:gameId

DTO:
{
  status: string,
}

# Пригласить в игру
POST api/v1/games/:gameId/invitation
{
  opponentId: userId,
}

DTO:
{
  status: string,
}

# Изменить противника
PATCH api/v1/games/:gameId/invitation
{
  opponentId: userId,
}

DTO:
{
  status: string,
}

# Подключится к игре
PUT api/v1/games/:gameId

DTO:
{
  status: string,
}

# Получить информацию об игре
GET api/v1/games/:gameId

DTO:
{
  status: string,
  game: Game,
}

# Сделать ход
PATCH api/v1/games/:gameId/step

{
  stepValue: number,
}

DTO:
{
  status: string,
}


# Получить информацию о всех своих играх (с филльтрацией)
GET api/v1/users/allgames?filter=:filter&sort=:sort&offset=:offset&limit=:limit

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

DTO:
{
  status: string,
  countGames: number,
  games: Game[],
}

# Получить статистику о чужих играх
GET api/v1/users/:userId/stats

DTO:
{
  status: string,
  stats: userId.stats,
}

# Поcмотреть leaderboard
GET api/v1/leaderboard?sort=:criterion&from=:date&to:=date&offset=:offset&limit=:limit

  -Сортировка(критерии)
    criterion: 'countWins' | 'countCompleted' | 'countStepsToWin',

  -Промежуток
    from: date,
    to: date,

  -Пагинация
    offset: number,
    limit: number,

DTO:
{
  status: string,
  countUsers: number,
  leadbord: User[],
}

# Посмотреть свои контакты
GET api/v1/users/contacts&offset=:offset&limit=:limit

  -Пагинация
    offset: number,
    limit: number,

DTO:
{
  status: string,
  countContacts: number,
  contacts: User[],
}
