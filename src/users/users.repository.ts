import { UserStats, LeaderboardWithTotalCount, UserStatsSanitize } from './users.types';
import { USER_ROLE } from './users.constants';
import { User } from './user.entity';

export class UsersRepository {
  static async create(username: string, password: string, email: string): Promise<User> {
    let user = User.create({
      username,
      password,
      email,
      role: USER_ROLE.USER,
    });

    user = await User.save(user);

    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return User.findOneBy({ email });
  }

  static async findById(id: number): Promise<User | null> {
    return User.findOneBy({ id });
  }

  static async getStats(userId: number): Promise<UserStats | null> {
    const [stats]: (UserStats | null)[] = await User.query(
      `SELECT "user".id AS "userId", 
      username, 
      SUM(CASE WHEN game."creatorId" = $1 OR game."opponentId" = $1 THEN 1 ELSE 0 END) AS "gamesCount",
      SUM(CASE WHEN game.status = 'finished' THEN 1 ELSE 0 END) AS "completedGamesCount",
      SUM(CASE WHEN game.status = 'finished' AND game."winnerId" = $1 THEN 1 ELSE 0 END) AS "winsCount",
      SUM(CASE WHEN game.status = 'finished' AND game."winnerId" != $1 AND game."winnerId" IS NOT null THEN 1 ELSE 0 END) AS "lossesCount",
      SUM(CASE WHEN game.status = 'finished' AND game."winnerId" = null THEN 1 ELSE 0 END) AS "drawsCount",
      (SELECT ROUND(AVG("winStepsCount"), 1) FROM 
        (SELECT COUNT(*) AS "winStepsCount"
            FROM game
             INNER JOIN step ON game.id = step."gameId"
              WHERE game.status = 'finished' AND game."winnerId" = $1
              AND step."userId" = $1
              GROUP BY game.id
          ) AS "stepsCountByGame"
      ) AS "averageStepsCountToWin"
      FROM "user"
      LEFT JOIN game ON game."creatorId" = "user".id OR game."opponentId" = "user".id
      WHERE "user".id = $1
      GROUP BY "userId", username;`,
      [userId]
    );

    if (stats) {
      return this.sanitizeUserStats(stats);
    }

    return stats;
  }

  static async getLeaderboardForAverageStepsToWin(
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<LeaderboardWithTotalCount> {
    const leaderboardPromise: Promise<UserStats[]> = User.query(
      `SELECT "user".id AS "userId", 
      username, 
      (SELECT ROUND(AVG("winStepsCount"), 1) FROM 
        (SELECT COUNT(*) AS "winStepsCount"
            FROM game
             INNER JOIN step ON game.id = step."gameId"
              WHERE game.status = 'finished' 
              AND game."winnerId" = "user".id
              AND step."userId" = "user".id
              AND game."createdAt" >= $1
              AND game."createdAt" <= $2
              GROUP BY game.id
          ) AS "stepsCountByGame"
      ) AS "averageStepsCountToWin"
      FROM "user"
      WHERE "user".role = 'user'
      ORDER BY "averageStepsCountToWin" ASC, username ASC
      OFFSET $3
      LIMIT $4;
    `,
      [dateFrom, dateTo, offset, limit]
    );

    const [totalCount, leaderboard] = await Promise.all([this.getTotalCountForLeaderboard(), leaderboardPromise]);

    leaderboard.forEach((el) => {
      el.averageStepsCountToWin = Number(el.averageStepsCountToWin);
    });

    return { totalCount, leaderboard };
  }

  static async getLeaderboardForCompletedGamesCount(
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<LeaderboardWithTotalCount> {
    const leaderboardPromise: Promise<UserStats[]> = User.query(
      `SELECT "user".id AS "userId", 
      username, 
      SUM(CASE WHEN game."createdAt" >= $1 AND game."createdAt" <= $2 THEN 1 ELSE 0 END) AS "completedGamesCount"
      FROM "user"
      LEFT JOIN game ON game.status = 'finished' AND (game."creatorId" = "user".id OR game."opponentId" = "user".id)
      WHERE "user".role = 'user'
      GROUP BY "userId", username
      ORDER BY "completedGamesCount" DESC, username ASC
      offset $3
      limit $4;`,
      [dateFrom, dateTo, offset, limit]
    );

    const [totalCount, leaderboard] = await Promise.all([this.getTotalCountForLeaderboard(), leaderboardPromise]);

    leaderboard.forEach((el) => {
      el.completedGamesCount = Number(el.completedGamesCount);
    });

    return { totalCount, leaderboard };
  }

  static async getLeaderboardForWinsCount(
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<LeaderboardWithTotalCount> {
    const leaderboardPromise: Promise<UserStats[]> = User.query(
      `SELECT "user".id AS "userId", 
      username, 
      SUM(CASE WHEN game."createdAt" >= $1 AND game."createdAt" <= $2 THEN 1 ELSE 0 END) AS "winsCount"
      FROM "user"
      LEFT JOIN game ON game.status = 'finished' AND game."winnerId" = "user".id
      WHERE "user".role = 'user'
      GROUP BY "userId", username
      ORDER BY "winsCount" DESC, username ASC
      offset $3
      limit $4;`,
      [dateFrom, dateTo, offset, limit]
    );

    const [totalCount, leaderboard] = await Promise.all([this.getTotalCountForLeaderboard(), leaderboardPromise]);

    leaderboard.forEach((el) => {
      el.winsCount = Number(el.winsCount);
    });

    return { totalCount, leaderboard };
  }

  static async getTotalCountForLeaderboard(): Promise<number> {
    return User.countBy({ role: USER_ROLE.USER });
  }

  static sanitizeUserStats(stats: UserStats): UserStatsSanitize {
    for (const key in stats) {
      if (key !== 'id' && key !== 'username') {
        stats[key] = Number(stats[key]);
      }
    }

    return stats as UserStatsSanitize;
  }
}
