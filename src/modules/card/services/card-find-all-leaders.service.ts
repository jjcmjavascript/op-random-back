import { Injectable } from '@nestjs/common';
import { CardFindAllRepository } from '../repositories/card-find-all.repository';
import { CardCategories } from '../types/card-categories.enum';
import { getUniqueByExpansion } from '../card.helper';

@Injectable()
export class CardFindAllLeadersService {
  constructor(private readonly findAll: CardFindAllRepository) {}

  async execute() {
    const leaders = await this.findAll.execute({
      where: {
        category: CardCategories.Leader,
      },
      orderBy: {
        cardId: 'asc',
      },
    });

    const uniqueLeaders = getUniqueByExpansion(leaders);

    return uniqueLeaders;
  }
}
