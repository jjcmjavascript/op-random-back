import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RankingInsertService } from './ranking-insert.service';
import { Logger } from '@shared/services/logger.service';

@Injectable()
export class RankingSchedulerService {
  private readonly logger = new Logger(RankingSchedulerService.name);

  constructor(private readonly rankingInsertService: RankingInsertService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyRankingUpdate() {
    this.logger.process('Iniciando actualización diaria de rankings...');

    try {
      const result = await this.rankingInsertService.execute();

      this.logger.process(
        `Ranking actualizado exitosamente. ${result.length} líderes procesados.`,
      );
    } catch (error) {
      this.logger.fromError(error);
    }
  }
}
