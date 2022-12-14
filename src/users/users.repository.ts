import { Game, GAME_STATUS, Step } from '@games';
import { Brackets } from 'typeorm';
import { User } from './user.entity';
import { Stats, STATS, USER_ROLE } from './users.constants';

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

  static async getStats(userId: number): Promise<Stats | null> {
    const stats = User.query(
      `SELECT id AS "userId", 
      username,
      (SELECT COUNT(*) FROM game WHERE "creatorId" = $1 OR "opponentId" = $1) AS "gamesCount",
      (SELECT COUNT(*) FROM game WHERE status = 'finished' AND "winnerId" = $1) AS "winsCount",
      (SELECT COUNT(*)
        FROM game
        WHERE status = 'finished'
          AND "winnerId" != $1 AND "winnerId" IS NOT NULL
          AND ("creatorId" = $1 OR "opponentId" = $1)
      ) AS "losesCount",
      (SELECT COUNT(*)
       FROM game
        WHERE status = 'finished' AND "winnerId" IS NULL
         AND ("creatorId" = $1 OR "opponentId" = $1)
      ) AS "drawsCount",
      (SELECT COUNT(*)
        FROM game
        WHERE status = 'finished' AND ("creatorId" = $1 OR "opponentId" = $1)
      ) AS "finishedGamesCount",
      (SELECT ROUND(AVG("winStepsCount"), 1) FROM 
  	 	  (SELECT COUNT(*) AS "winStepsCount"
     		  FROM game AS g
     		  INNER JOIN step AS s ON g.id = s."gameId"
      	  WHERE g.status = 'finished' AND g."winnerId" = $1
      	  AND s."userId" = $1
      	  GROUP BY g.id
    	  ) AS "stepsCountByGame"
      ) AS "averageStepsToWin"
      FROM "user"
      where "user".id = $1;`,
      [userId]
    );

    return stats;
  }

  static async getLeaderboardForAverageStepsToWin(
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<{ totalCount: number; leaderboard: Stats[] }> {
    const leaderboardPromise = User.createQueryBuilder('user')
      .select('user.id')
      .addSelect('user.username')
      .addSelect(
        (qb) =>
          qb
            .select('ROUND(AVG("winStepsCount"))')
            .from(
              (qb) =>
                qb
                  .select('COUNT(*)', 'winStepsCount')
                  .from(Game, 'game')
                  .innerJoin(Step, 'step', 'game.id = step."gameId"')
                  .where('game.status = :status', { status: GAME_STATUS.FINISHED })
                  .andWhere('game."winnerId" = user.id')
                  .andWhere('step."userId" = user.id')
                  .andWhere('game."createdAt" >= :from', { from: dateFrom })
                  .andWhere('game."createdAt" <= :to', { to: dateTo }),
              'stepsCountByGame'
            ),
        STATS.AVERAGE_STEPS_COUNT_TO_WIN
      )
      .orderBy('"averageStepsCountToWin"', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();

    const totalCountPromise = User.count();

    const [totalCount, leaderboard] = await Promise.all([totalCountPromise, leaderboardPromise]);

    return { totalCount, leaderboard };
  }

  static async getLeaderboardForCompletedGamesCount(
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<{ totalCount: number; leaderboard: Stats[] }> {
    const leaderboardPromise = User.createQueryBuilder('user')
      .select('user.id')
      .addSelect('user.username')
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(game)')
            .from(Game, 'game')
            .where(
              new Brackets((qb) => {
                qb.where('"creatorId" = user.id').orWhere('"opponentId" = user.id');
              })
            )
            .andWhere('status = :status', { status: GAME_STATUS.FINISHED })
            .andWhere('"createdAt" >= :from', { from: dateFrom })
            .andWhere('"createdAt" <= :to', { to: dateTo }),
        STATS.COMPLETED_GAMES_COUNT
      )
      .groupBy('user.id')
      .orderBy('"completedGamesCount"', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();

    const totalCountPromise = User.count();

    const [totalCount, leaderboard] = await Promise.all([totalCountPromise, leaderboardPromise]);

    return { totalCount, leaderboard };
  }

  static async getLeaderboardForWinsCount(
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<{ totalCount: number; leaderboard: Stats[] }> {
    const leaderboardPromise = User.createQueryBuilder('user')
      .select('user.id')
      .addSelect('user.username')
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(game)')
            .from(Game, 'game')
            .where('status = :status', { status: GAME_STATUS.FINISHED })
            .andWhere('"winnerId" = user.id')
            .andWhere('"createdAt" >= :from', { from: dateFrom })
            .andWhere('"createdAt" <= :to', { to: dateTo }),
        STATS.WINS_COUNT
      )
      .groupBy('user.id')
      .orderBy('"winsCount"', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();

    const totalCountPromise = User.count();

    const [totalCount, leaderboard] = await Promise.all([totalCountPromise, leaderboardPromise]);

    return { totalCount, leaderboard };
  }
}
