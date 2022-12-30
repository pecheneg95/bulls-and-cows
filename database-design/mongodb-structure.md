```typescript
User {
  id!: ObjectId("userId")
  username!: string;
  password!: string;
  email!: string;
  role!: USER_ROLE; // user || admin, user by default
  createdAt!: Date;
  updatedAt!: Date;
}

Game {
  id!: ObjectId("gameId")
  players: [{
    id: ObjectId("userId");
    isCreator: boolean;
    hiddenAnswer: string || null;
    steps: [{
      id!: ObjectId("userId");
      sequence!: number;
      value!: string;
      bulls!: number;
      cows!: number;
      createdAt!: Date;
    }]
  }]
  status!: GAME_STATUS; // created || playing || finished
  hiddenAnswerLength!: number; // DEFAULT_HIDDEN_LENGTH = 4
  winnerId: ObjectId("userId from players") || null;
  createdAt!: Date;
  updatedAt!: Date;
}
```
