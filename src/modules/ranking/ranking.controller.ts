import { Controller, Get } from '@nestjs/common';
import { RankingFindAllService } from './services/ranking-find-all.service';
import { RankingInsertService } from './services/ranking-insert.service';

@Controller('ranking')
export class RankingController {
  constructor(
    private readonly rankingFindAllRepository: RankingFindAllService,
    private readonly rankingInsertService: RankingInsertService,
  ) {}

  @Get()
  findAll() {
    return this.rankingFindAllRepository.execute();
  }
}
