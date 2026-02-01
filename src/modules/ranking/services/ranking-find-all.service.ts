import { Injectable } from '@nestjs/common';
import { RankingFindAllRepository } from '../repositories/ranking-find-all.repository';
import { CardFindAllRepository } from '../../card/repositories/card-find-all.repository';
import {
  getEndOfDay,
  getPreviousNDays,
  getStartOfDay,
} from '@shared/helpers/date.helper';

@Injectable()
export class RankingFindAllService {
  constructor(
    private readonly rankingFindAllRepository: RankingFindAllRepository,
    private readonly cardFindAllRepository: CardFindAllRepository,
  ) {}

  async execute() {
    const previousDay = getPreviousNDays(1);
    const result = await this.rankingFindAllRepository.execute({
      where: {
        day: {
          gte: getStartOfDay(previousDay),
          lte: getEndOfDay(previousDay),
        },
      },
    });

    const leaders = result[0]?.leaders || [];

    // Obtener los IDs de las cartas de los líderes
    const leaderCardIds = leaders.map((leader) => leader.leader);

    // Buscar las cartas correspondientes
    const cards = await this.cardFindAllRepository.execute({
      where: {
        cardId: {
          in: leaderCardIds,
        },
      },
    });

    // Crear un mapa de cardId -> card para acceso rápido
    const cardMap = new Map(cards.map((card) => [card.cardId, card]));

    return leaders.map((leader) => {
      const card = cardMap.get(leader.leader);
      const weightedWinRate = leader.weighted_win_rate * 100;

      return {
        leader: leader.leader,
        leaderName: leader.leaderName,
        wins: leader.wins,
        matches: leader.number_of_matches,
        winRate: weightedWinRate.toFixed(2),
        firstWinRate: (leader.first_win_rate * 100).toFixed(2),
        secondWinRate: (leader.second_win_rate * 100).toFixed(2),
        imgUrl: card?.imgUrl || null,
        imgFullUrl: card?.imgFullUrl || null,
      };
    });
  }
}
