import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindTreeCardsDto } from '../dto/find-cards.dto';
import { CardFindAllRepository } from '../repositories/card-find-all.repository';
import { CardCategories } from '../types/card-categories.enum';
import {
  filterByArchetype,
  getNCards,
  getUniqueByExpansion,
  randomSort,
} from '../card.helper';
import { BANNED_CARDS } from '../cards-banned';

@Injectable()
export class CardFindTreeCardsService {
  constructor(private readonly findAll: CardFindAllRepository) {}

  async execute(findParams: FindTreeCardsDto) {
    const normalized = this.normalizeParams(findParams);
    const where = this.buildWhere(normalized);
    const cards = await this.findAll.execute({ where });

    const uniqueByExpansion = getUniqueByExpansion(cards);
    const twentyPercentOfUniqueCards = Math.ceil(
      uniqueByExpansion.length * 0.3,
    );

    const increseArchetypeDiversity = randomSort(
      filterByArchetype({
        cards,
        archetypes: findParams.leaderArchetypes || [],
      }),
    ).slice(0, twentyPercentOfUniqueCards);

    const nCardsResult = getNCards({
      n: findParams.cardsQuantity || 3,
      cards: randomSort([...uniqueByExpansion, ...increseArchetypeDiversity]),
    });

    return nCardsResult as typeof cards;
  }

  private normalizeParams(findParams: FindTreeCardsDto) {
    return {
      ...findParams,
      omitCharacterWithBlocker: findParams.omitCharacterWithBlocker ?? false,
      omitCharacterWithNoCounter:
        findParams.omitCharacterWithNoCounter ?? false,
    };
  }

  private buildWhere(findParams: FindTreeCardsDto): Prisma.CardWhereInput {
    const and: Prisma.CardWhereInput[] = [];
    const not: Prisma.CardWhereInput[] = [
      { category: CardCategories.Leader },
      { cardId: { in: BANNED_CARDS } },
    ];

    if (findParams.expansions?.length) {
      not.push({
        expansion: {
          in: findParams.expansions.map((i) => i.toLocaleLowerCase()),
        },
      });
    }

    if (findParams.leaderColors?.length) {
      and.push({ colors: { hasSome: findParams.leaderColors } });
    }

    if (findParams.omitCharacterWithNoEffect) {
      not.push({
        AND: [
          { category: CardCategories.Character },
          { effect: { equals: '' } },
        ],
      });
    }

    const costRange = this.buildNumberRange(
      findParams.minCost ?? 0,
      findParams.maxCost ?? 20000,
    );

    if (costRange) {
      and.push({ cost: costRange });
    }

    const powerRange = this.buildNumberRange(
      findParams.minAttack ?? 0,
      findParams.maxAttack ?? 20000,
    );

    if (powerRange) {
      and.push({
        OR: [
          { category: { not: CardCategories.Character } },
          { power: powerRange },
        ],
      });
    }

    if (findParams.omitCharacterWithBlocker) {
      not.push({
        AND: [
          { category: CardCategories.Character },
          { effect: { contains: '[Blocker]' } },
        ],
      });
    }

    if (findParams.omitCharacterWithNoCounter) {
      not.push({
        AND: [{ category: CardCategories.Character }, { counter: { lte: 0 } }],
      });
    }

    if (findParams?.omitAlternateArts) {
      not.push({
        id: { contains: '_' },
      });
    }

    return {
      AND: and.length ? and : undefined,
      NOT: not.length ? not : undefined,
    };
  }

  private buildNumberRange(min: number, max: number) {
    if (min === undefined || max === undefined) {
      return null;
    }

    const range = {} as Record<string, number>;

    if (min !== undefined) {
      range.gte = min;
    }

    if (max !== undefined) {
      range.lte = max;
    }

    return range;
  }
}
