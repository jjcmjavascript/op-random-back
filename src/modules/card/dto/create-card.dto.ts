import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  cardId: string;

  @IsString()
  packId: string;

  @IsString()
  name: string;

  @IsString()
  rarity: string;

  @IsString()
  category: string;

  @IsString()
  imgUrl: string;

  @IsString()
  imgFullUrl: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  colors: string[];

  @IsOptional()
  @IsInt()
  cost?: number;

  @IsArray()
  @IsString({ each: true })
  attributes: string[];

  @IsOptional()
  @IsInt()
  power?: number;

  @IsOptional()
  @IsInt()
  counter?: number;

  @IsArray()
  @IsString({ each: true })
  types: string[];

  @IsString()
  effect: string;

  @IsOptional()
  @IsString()
  trigger?: string;
}
