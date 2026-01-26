import { Injectable } from '@nestjs/common';
import { FetchService } from '@shared/services/fetch/fetch.service';
import { RankingCreateRepository } from '../repositories/ranking-create.repository';
import { LeaderStat, LeaderStatCamelCase } from '../types/ranking.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RankingInsertService {
  constructor(
    private readonly fetchService: FetchService,
    private readonly rankingCreateRepository: RankingCreateRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(): Promise<LeaderStatCamelCase[]> {
    const response = await this.fetchService.send<LeaderStat[]>({
      url: this.configService.get<string>('ranking_url')!,
      method: 'get',
    });

    const top10Leaders = response.data.slice(0, 10).map((leaderStat) => ({
      leader: leaderStat.leader,
      leaderName: leaderStat.leaderName,
      wins: leaderStat.wins,
      number_of_matches: leaderStat.number_of_matches,
      total_matches: leaderStat.total_matches,
      raw_win_rate: leaderStat.raw_win_rate,
      play_rate: leaderStat.play_rate,
      weighted_win_rate: leaderStat.weighted_win_rate,
      first_win_rate: leaderStat.first_win_rate,
      second_win_rate: leaderStat.second_win_rate,
    }));

    const ranking = await this.rankingCreateRepository.execute({
      day: new Date(),
      leaders: top10Leaders,
      source: 'web',
      format: this.configService.get<string>('op_format'),
    });

    return ranking.leaders.map((leader) => ({
      leader: leader.leader,
      leaderName: leader.leaderName,
      wins: leader.wins,
      matches: leader.number_of_matches,
      winRate: Math.round((leader.wins / leader.number_of_matches) * 100),
      first: leader.first_win_rate.toFixed(2),
      second: leader.second_win_rate.toFixed(2),
    }));
  }
}
