# ENTITIES

## 1. User
```Typescript
{
  id: number,
  username: string,
  password: string,
  email: string,
  role: USER_ROLE,
  createdAt: Date,
  updatedAt: Date,
}
```

## 2. Game
```Typescript
{
  id: number,
  creatorId: number,
  opponentId: number,
  status: GAME_STATUS,
  winnerId: number | null,
  hiddenByCreator: string || null, 
  hiddenByOpponent: string || null, 
  hiddenLength: number,
  createdAt: Date,
  updatedAt: Date,
}
```
## 3. Step
```Typescript
{
  id: number,
  userId: number,
  gameId: number,
  sequence: number,
  value: string, 
  bulls: number,
  cows: number,
  createdAt: Date,
}
```
## RELATIONS
```Typescript
1. User - Game: one-to-many relation
    User.id(PK) - Game.opponentId(FK),  Game.creatorId(FK)

2. User - Step: one-to-many relation
    User.id(PK) - Step.userId(FK)

3. Game - Step:  one-to-many relation
    Game.id(PK) - Step.gameId(FK)
```
