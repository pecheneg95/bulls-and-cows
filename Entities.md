# ENTITIES

## 1. User
```Typescript
{
  id: number,
  username: string,
  password: string,
  email: string,
  role: 'member' | 'admin',
  createdAt: date,
  updatedAt: date,
}
```

## 2. Game
```Typescript
{
  id: number,
  creatorId: number,
  opponentId: number,
  status:  'created' | 'started' | 'finished'
  winnerId: number || null,
  hiddenNumberByCreator: number || null, 
  hiddenNumberByOpponent: number || null, 
  hiddenNumberLength: number,
  createdAt: date,
  updatedAt: date,
}
```
## 3. Step
```Typescript
{
  id: number,
  userId: number,
  gameId: number,
  sequence: number,
  value: number, 
  bulls: number,
  cows: number,
  createdAt: date,
  updatedAt: date,
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
