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
    const startTime = new Date();
    this.logger.process(
      `[CRON] Iniciando actualización diaria de rankings... Fecha: ${startTime.toISOString()}`,
    );

    try {
      this.logger.process(
        '[CRON] Llamando a rankingInsertService.execute()...',
      );
      const result = await this.rankingInsertService.execute();

      if (!result || result.length === 0) {
        this.logger.process(
          '[CRON] ⚠️ ADVERTENCIA: El servicio retornó sin líderes procesados',
        );
        return;
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      this.logger.process(
        `[CRON] ✅ Ranking actualizado exitosamente. ${result.length} líderes procesados en ${duration}ms`,
      );
      this.logger.process(
        `[CRON] Líderes guardados: ${result.map((l) => l.leaderName).join(', ')}`,
      );
    } catch (error) {
      this.logger.error(`[CRON] ❌ ERROR al actualizar ranking:`, error);
      this.logger.fromError(error);
      throw error; // Re-lanzar para que NestJS lo registre
    }
  }
}
