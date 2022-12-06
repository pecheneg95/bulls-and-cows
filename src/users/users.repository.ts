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
    const stats = User.createQueryBuilder()
      .select('user.id')
      .addSelect('user.username')
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(game)')
            .from(Game, 'game')
            .where(
              new Brackets((qb) => {
                qb.where('"creatorId" = :id', { id: userId }).orWhere('"opponentId" = :id', { id: userId });
              })
            ),
        STATS.GAMES_COUNT
      )
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(game)')
            .from(Game, 'game')
            .where(
              new Brackets((qb) => {
                qb.where('"creatorId" = :id', { id: userId }).orWhere('"opponentId" = :id', { id: userId });
              })
            )
            .andWhere('status = :status', { status: GAME_STATUS.FINISHED }),
        STATS.COMPLETED_GAMES_COUNT
      )
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(game)')
            .from(Game, 'game')
            .where('status = :status', { status: GAME_STATUS.FINISHED })
            .andWhere('"winnerId" = :id', { id: userId }),
        STATS.WINS_COUNT
      )
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(game)')
            .from(Game, 'game')
            .where(
              new Brackets((qb) => {
                qb.where('"creatorId" = :id', { id: userId }).orWhere('"opponentId" = :id', { id: userId });
              })
            )
            .andWhere('status = :status', { status: GAME_STATUS.FINISHED })
            .andWhere('"winnerId" != :id', { id: userId })
            .andWhere('"winnerId" IS NOT NULL'),
        STATS.LOSSES_COUNT
      )
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(game)')
            .from(Game, 'game')
            .where(
              new Brackets((qb) => {
                qb.where('"creatorId" = :id', { id: userId }).orWhere('"opponentId" = :id', { id: userId });
              })
            )
            .andWhere('status = :status', { status: GAME_STATUS.FINISHED })
            .andWhere('"winnerId" IS NULL'),
        STATS.DRAW_COUNT
      )
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
                  .andWhere('game."winnerId" = :id', { id: userId })
                  .andWhere('step."userId" = :id', { id: userId }),
              'stepsCountByGame'
            ),
        STATS.AVERAGE_STEPS_COUNT_TO_WIN
      )
      .where('user.id = :id', { id: userId })
      .from(User, 'user')
      .groupBy('user.id')
      .getRawOne();

    return stats;
  }

  static async getLeaderboardForAverageStepsToWin(
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<{ totalCount: number; leaderboard: Stats[] }> {
    const leaderboardPromise = User.createQueryBuilder()
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
      .from(User, 'user')
      .groupBy('user.id')
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
    const leaderboardPromise = User.createQueryBuilder()
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
      .from(User, 'user')
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
    const leaderboardPromise = User.createQueryBuilder()
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
      .from(User, 'user')
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
