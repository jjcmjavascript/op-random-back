import { Injectable } from '@nestjs/common';
import { FetchService } from '@shared/services/fetch/fetch.service';
import { RankingCreateRepository } from '../repositories/ranking-create.repository';
import { LeaderStat, LeaderStatCamelCase } from '../types/ranking.interface';
import { ConfigService } from '@nestjs/config';
import { getStartOfDay } from '@shared/helpers/date.helper';

@Injectable()
export class RankingInsertService {
  constructor(
    private readonly fetchService: FetchService,
    private readonly rankingCreateRepository: RankingCreateRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(): Promise<LeaderStatCamelCase[]> {
    console.log('[RankingInsert] 1. Fetching ranking data...');
    const rankingUrl = this.configService.get<string>('ranking_url');
    console.log(`[RankingInsert] URL: ${rankingUrl}`);

    const response = await this.fetchService.send<LeaderStat[]>({
      url: rankingUrl!,
      method: 'get',
    });

    console.log(
      `[RankingInsert] 2. Datos recibidos: ${response.data?.length || 0} líderes`,
    );

    if (!response.data || response.data.length === 0) {
      throw new Error('No se recibieron datos del ranking');
    }

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

    console.log(
      `[RankingInsert] 3. Top 10 líderes preparados: ${top10Leaders.map((l) => l.leaderName).join(', ')}`,
    );

    // Usar solo la fecha sin hora para evitar duplicados
    const today = getStartOfDay();

    const format = this.configService.get<string>('op_format');
    console.log(
      `[RankingInsert] 4. Guardando en DB - Fecha: ${today.toISOString()}, Formato: ${format}`,
    );

    try {
      const ranking = await this.rankingCreateRepository.execute({
        day: today,
        leaders: top10Leaders,
        source: 'web',
        format: format,
      });

      console.log(
        `[RankingInsert] 5. ✅ Ranking guardado exitosamente - ID: ${ranking.id}`,
      );
      console.log(
        `[RankingInsert] Líderes guardados: ${ranking.leaders.length}`,
      );

      return ranking.leaders.map((leader) => ({
        leader: leader.leader,
        leaderName: leader.leaderName,
        wins: leader.wins,
        matches: leader.number_of_matches,
        winRate: Math.round((leader.wins / leader.number_of_matches) * 100),
        first: leader.first_win_rate.toFixed(2),
        second: leader.second_win_rate.toFixed(2),
      }));
    } catch (error) {
      console.error('[RankingInsert] ❌ Error al guardar en DB:', error);
      throw error;
    }
  }
}
