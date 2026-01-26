import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CardFindTreeLeadersService } from './services/card-find-tree-leaders.service';
import { CardFindAllRepository } from './repositories/card-find-all.repository';
import { CardFindTreeCardsService } from './services/card-find-tree-cards.service';
import { CardGenerateRandomDeckService } from './services/card-generate-random-deck.service';
import { CardFindAllLeadersService } from './services/card-find-all-leaders.service';

@Module({
  controllers: [CardController],
  providers: [
    CardFindAllRepository,
    CardFindTreeLeadersService,
    CardFindTreeCardsService,
    CardGenerateRandomDeckService,
    CardFindAllLeadersService,
    PrismaService,
  ],
})
export class CardModule {}
