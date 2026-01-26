import { Injectable } from '@nestjs/common';
import { FindTreeLeadersDto } from '../dto/find-cards.dto';
import { CardFindAllRepository } from '../repositories/card-find-all.repository';
import { CardCategories } from '../types/card-categories.enum';
import { getNCards, getUniqueByExpansion, randomSort } from '../card.helper';
import { BANNED_CARDS } from '../cards-banned';
import { Prisma } from '@prisma/client';

@Injectable()
export class CardFindTreeLeadersService {
  constructor(private readonly findAll: CardFindAllRepository) {}

  async execute(findParams: FindTreeLeadersDto) {
    const notConditions = this.buildNotConditions(findParams);

    const allCards = await this.findAll.execute({
      where: {
        category: CardCategories.Leader,
        NOT: notConditions,
      },
    });

    const randomized = randomSort(allCards);
    const uniqueByExpansion = getUniqueByExpansion(
      randomized as typeof allCards,
    );

    const nLeaders = getNCards({
      n: findParams.leaderQuantity || 3,
      cards: uniqueByExpansion,
    });

    return nLeaders as typeof allCards;
  }

  private buildNotConditions(findParams: FindTreeLeadersDto): any[] {
    const conditions: Prisma.CardWhereInput[] = [
      { cardId: { in: BANNED_CARDS } },
    ];

    if (findParams?.colors && findParams.colors.length > 0) {
      conditions.push({
        colors: {
          hasSome: findParams.colors,
        },
      });
    }

    if (findParams?.expansions && findParams?.expansions.length > 0) {
      conditions.push({
        expansion: {
          in: findParams.expansions?.map((e) => e.toString().toLowerCase()),
        },
      });
    }

    if (findParams?.omitAlternateArts) {
      console.log('Omitting alternate arts', findParams);
      conditions.push({
        cardId: { contains: '_' },
      });
    }

    return conditions;
  }
}
