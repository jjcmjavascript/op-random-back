import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toArray } from '../card.helper';

export class FindCardsDto {
  @IsOptional()
  @IsString()
  keywords?: string;
}

export class FindTreeLeadersDto {
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  expansions?: string[];

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  colors?: string[];

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(5)
  leaderQuantity?: number;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;

    return undefined;
  })
  @IsOptional()
  omitAlternateArts?: boolean;
}

export class FindTreeCardsDto {
  @IsOptional()
  @Transform(toArray)
  expansions?: string[];

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  leaderColors: string[];

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  maxCost?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  minCost?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(13000)
  maxAttack?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(13000)
  minAttack?: number;

  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;

    return undefined;
  })
  @IsOptional()
  omitCharacterWithBlocker?: boolean;

  @IsOptional()
  omitCharacterWithNoEffect?: boolean;

  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;

    return undefined;
  })
  @IsOptional()
  omitCharacterWithNoCounter?: boolean;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(10)
  cardsQuantity?: number;

  @IsOptional()
  @Transform(toArray)
  leaderArchetypes?: string[];

  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;

    return undefined;
  })
  @IsOptional()
  omitAlternateArts?: boolean;
}

export class FindRandomDeckDto extends FindTreeLeadersDto {
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  leaderColors: string[];

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  maxCost?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  minCost?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(13000)
  maxAttack?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(13000)
  minAttack?: number;

  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;

    return undefined;
  })
  @IsOptional()
  omitCharacterWithBlocker?: boolean;

  @IsOptional()
  omitCharacterWithNoEffect?: boolean;

  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;

    return undefined;
  })
  @IsOptional()
  omitCharacterWithNoCounter?: boolean;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(10)
  cardsQuantity?: number;
}
