import { Injectable } from '@nestjs/common';
import { Prisma, Card } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class CardFindAllRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(args: Prisma.CardFindManyArgs): Promise<Card[]> {
    return this.prisma.card.findMany(args);
  }
}
