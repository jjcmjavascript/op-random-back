import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/services/prisma/prisma.service';

@Injectable()
export class RankingCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: Prisma.RankingCreateInput) {
    return this.prisma.ranking.create({
      data,
    });
  }
}
