import { Body, Controller, Get, Query } from '@nestjs/common';
import {
  FindRandomDeckDto,
  FindTreeCardsDto,
  FindTreeLeadersDto,
} from './dto/find-cards.dto';
import { CardFindTreeCardsService } from './services/card-find-tree-cards.service';
import { CardFindTreeLeadersService } from './services/card-find-tree-leaders.service';
import { CardGenerateRandomDeckService } from './services/card-generate-random-deck.service';
import { CardFindAllLeadersService } from './services/card-find-all-leaders.service';

@Controller('cards')
export class CardController {
  constructor(
    private readonly findTreeLeadersService: CardFindTreeLeadersService,
    private readonly findTreeCardsService: CardFindTreeCardsService,
    private readonly generateRandomDeckService: CardGenerateRandomDeckService,
    private readonly findAllLeadersService: CardFindAllLeadersService,
  ) {}

  @Get('/tree-leaders')
  findTreeLeaders(@Query() query: FindTreeLeadersDto) {
    return this.findTreeLeadersService.execute(query);
  }

  @Get('/tree-cards')
  findTreeCards(@Query() query: FindTreeCardsDto) {
    return this.findTreeCardsService.execute(query);
  }

  @Get('/generate-random-deck')
  generateRandomDeck(@Query() query: FindRandomDeckDto) {
    return this.generateRandomDeckService.execute(query);
  }

  @Get('/leaders')
  findAllLeaders() {
    return this.findAllLeadersService.execute();
  }
}
