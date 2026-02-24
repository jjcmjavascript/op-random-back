import { Injectable } from '@nestjs/common';
import { FetchService } from '@shared/services/fetch/fetch.service';
import { RankingCreateRepository } from '../repositories/ranking-create.repository';
import { LeaderStat, LeaderStatCamelCase } from '../types/ranking.interface';
import { ConfigService } from '@nestjs/config';
import { getStartOfDay } from '@shared/helpers/date.helper';
import { Logger } from '@shared/services/logger.service';
import { GetUrlFromOriginService } from './get-url-from-origin.service';

@Injectable()
export class RankingInsertService {
  private logger = new Logger(RankingInsertService.name);

  constructor(
    private readonly fetchService: FetchService,
    private readonly rankingCreateRepository: RankingCreateRepository,
    private readonly configService: ConfigService,
    private readonly getUrlFromOriginService: GetUrlFromOriginService,
  ) {}

  async execute(): Promise<LeaderStatCamelCase[]> {
    this.logger.process('1. Getting URLs from origin...');
    const urls = await this.getUrlFromOriginService.execute();
    const urlsArray = Array.from(urls);

    if (urlsArray.length === 0) {
      this.logger.process('no url founded');
      return [];
    }

    const rankingUrl = urlsArray[0];
    this.logger.process(`2. URL found: ${rankingUrl}`);

    const response = await this.fetchService.send<LeaderStat[]>({
      url: rankingUrl,
      method: 'get',
    });

    this.logger.process(
      `3. Datos recibidos: ${response.data?.length || 0} líderes`,
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

    this.logger.process(
      `3. Top 10 líderes preparados: ${top10Leaders.map((l) => l.leaderName).join(', ')}`,
    );

    // Usar solo la fecha sin hora para evitar duplicados
    const today = getStartOfDay();

    const format = this.configService.get<string>('op_format');

    this.logger.process(
      `4. Guardando en DB - Fecha: ${today.toISOString()}, Formato: ${format}`,
      {
        day: today,
        leaders: top10Leaders,
        source: 'web',
        format: format,
      },
    );

    try {
      const ranking = await this.rankingCreateRepository.execute({
        day: today,
        leaders: top10Leaders,
        source: 'web',
        format: format,
      });

      this.logger.process(
        `5. ✅ Ranking guardado exitosamente - ID: ${ranking.id}`,
      );
      this.logger.process(`6. Líderes guardados: ${ranking.leaders.length}`);

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
      this.logger.error('❌ Error al guardar en DB:', error);
      throw error;
    }
  }
}
