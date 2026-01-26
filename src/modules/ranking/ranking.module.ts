import { Module } from '@nestjs/common';
import { RankingFindAllService } from './services/ranking-find-all.service';
import { RankingFindAllRepository } from './repositories/ranking-find-all.repository';
import { RankingController } from './ranking.controller';
import { PrismaService } from '@shared/services/prisma/prisma.service';
import { RankingInsertService } from './services/ranking-insert.service';
import { RankingCreateRepository } from './repositories/ranking-create.repository';
import { CardFindAllRepository } from '../card/repositories/card-find-all.repository';
import { RankingSchedulerService } from './services/ranking-scheduler.service';
import { FetchService } from '@shared/services/fetch/fetch.service';

@Module({
  providers: [
    PrismaService,
    FetchService,
    RankingFindAllRepository,
    RankingCreateRepository,
    CardFindAllRepository,
    RankingFindAllService,
    RankingInsertService,
    RankingSchedulerService,
  ],
  controllers: [RankingController],
})
export class RankingModule {}
