import { User } from './user.entity';
import { UsersRepository } from 'users/users.repository';
import { STATS, Stats } from './users.constants';

export class UsersService {
  static async findById(id: number): Promise<User | null> {
    return UsersRepository.findById(id);
  }

  static async getStats(userId: number): Promise<Stats | null> {
    const stats = UsersRepository.getStats(userId);

    return stats;
  }

  static async getLeaderboard(
    sortField: STATS,
    dateFrom: Date,
    dateTo: Date,
    offset: number,
    limit: number
  ): Promise<{ totalCount: number; leaderboard: Stats[] } | null> {
    if (sortField === STATS.AVERAGE_STEPS_COUNT_TO_WIN) {
      return UsersRepository.getLeaderboardForAverageStepsToWin(dateFrom, dateTo, offset, limit);
    }

    if (sortField === STATS.COMPLETED_GAMES_COUNT) {
      return UsersRepository.getLeaderboardForCompletedGamesCount(dateFrom, dateTo, offset, limit);
    }

    return UsersRepository.getLeaderboardForWinsCount(dateFrom, dateTo, offset, limit);
  }
}
