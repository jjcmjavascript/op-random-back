import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/services/prisma/prisma.service';

@Injectable()
export class RankingFindAllRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(params?: Prisma.RankingFindManyArgs) {
    const ranking = await this.prisma.ranking.findMany(params);

    return ranking;
  }
}

// [
//       {
//         leader: 'ST29-001',
//         leaderName: 'Monkey D. Luffy',
//         wins: 32446,
//         number_of_matches: 58422,
//         total_matches: 562408,
//         raw_win_rate: 0.5553729759337236,
//         play_rate: 0.10387832321019616,
//         weighted_win_rate: 0.5433667554425525,
//         first_win_rate: 0.45543028631681404,
//         second_win_rate: 0.6283615685345338,
//       },

//       {
//         leader: 'OP13-079',
//         leaderName: 'Imu',
//         wins: 21232,
//         number_of_matches: 39348,
//         total_matches: 562408,
//         raw_win_rate: 0.5395954051031818,
//         play_rate: 0.06996344290977369,
//         weighted_win_rate: 0.5240175956557063,
//         first_win_rate: 0.4303459547807137,
//         second_win_rate: 0.6351164673938932,
//       },
//     ]
