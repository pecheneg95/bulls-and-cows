# ENTITIES

## 1. User
```Typescript
{
  id: number,
  name: string,
  password: string,
  email: string,
}
```
## 2. Stats
```Typescript
{
  id: number,
  userId: number,
  countGames: number,
  countWins: number,
  countCompleted: number,
  countStepsToWin: number,
}
```
## 3. Game
```Typescript
{
  id: number,
  creatorId: number,
  opponentId: number,
  status:  'created' | 'started' | 'finished'
  winnerId: number || null,
  answer: number || null, 
}
```
## 4. Step
```Typescript
{
  id: number,
  userId: number,
  gameId: number,
  sequence: number,
  value: number, 
}
```
## RELATIONS
```Typescript
1. User - Stats: one-to-one relation
    Stats.usersId(PK)

2. User - Game: one-to-many relation
    User.id(PK) - Game.opponentId(FK),  Game.creatorId(FK)

3. User - Step: one-to-many relation
    User.id(PK) - Step.userId(FK)

4. Game - Step:  one-to-many relation
    Game.id(PK) - Step.gameId(FK)
```
