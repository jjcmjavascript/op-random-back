import { Injectable } from '@nestjs/common';
import { FindTreeCardsDto, FindTreeLeadersDto } from '../dto/find-cards.dto';
import { CardFindTreeLeadersService } from './card-find-tree-leaders.service';
import { CardFindTreeCardsService } from './card-find-tree-cards.service';
import { internalPrint } from '@shared/helpers/dd.helper';
import { forceToArray } from '../card.helper';

@Injectable()
export class CardGenerateRandomDeckService {
  constructor(
    private readonly findTreeLeadersService: CardFindTreeLeadersService,
    private readonly findTreeCardsService: CardFindTreeCardsService,
  ) {}

  async execute(params: FindTreeLeadersDto & FindTreeCardsDto) {
    const leaderParams: FindTreeLeadersDto = {
      expansions: forceToArray<string>(params.expansions),
      colors: forceToArray<string>(params.colors),
      leaderQuantity: 1,
    };

    const leaders = await this.findTreeLeadersService.execute(leaderParams);
    const selectedLeader = leaders[0];

    if (!selectedLeader) {
      throw new Error('No se pudo encontrar un líder con los filtros dados');
    }

    // 2. Generar cartas hasta completar 50
    const deckCards: unknown[] = [];
    const MAX_DECK_SIZE = 50;
    const CARDS_PER_REQUEST = 3;

    while (deckCards.length < MAX_DECK_SIZE) {
      const cardsParams: FindTreeCardsDto = {
        leaderColors: forceToArray<string>(selectedLeader.colors),
        expansions: forceToArray<string>(params.expansions),
        minCost: params.minCost ?? 0,
        maxCost: params.maxCost ?? 10,
        omitCharacterWithBlocker: params.omitCharacterWithBlocker ?? false,
        omitCharacterWithNoEffect: params.omitCharacterWithNoEffect ?? false,
        omitCharacterWithNoCounter: params.omitCharacterWithNoCounter ?? false,
        cardsQuantity: CARDS_PER_REQUEST,
        leaderArchetypes: selectedLeader.types || [],
      };

      internalPrint(cardsParams);

      const newCards = await this.findTreeCardsService.execute(cardsParams);

      // Agregar cartas sin duplicados (máximo 4 copias por carta)
      for (const card of newCards) {
        if (deckCards.length >= MAX_DECK_SIZE) break;

        const cardCount = deckCards.filter((c: { id: string }) => {
          const cId = c.id?.split('_')[0];
          const cardId = card.id?.split('_')[0];

          return cId === cardId;
        }).length;

        if (cardCount < 4) {
          deckCards.push(card);
        }
      }

      // Seguridad: si no hay más cartas disponibles, romper el loop
      if (newCards.length === 0) {
        break;
      }
    }

    return {
      leader: selectedLeader,
      cards: deckCards.slice(0, MAX_DECK_SIZE),
      totalCards: deckCards.length,
    };
  }
}
