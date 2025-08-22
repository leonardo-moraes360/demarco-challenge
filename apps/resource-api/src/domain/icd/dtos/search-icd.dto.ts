import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchIcdDto {
  @ApiPropertyOptional({
    description: 'Termo de busca para códigos CID',
    example: 'diabetes',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Código CID específico',
    example: 'E10',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'Versão do ICD (10 ou 11)',
    example: '10',
  })
  @IsOptional()
  @IsString()
  icdVersion?: string;

  @ApiPropertyOptional({
    description: 'Propriedades a serem retornadas',
    example: 'Title,Definition,Exclusion',
  })
  @IsOptional()
  @IsString()
  propertiesToBeSearched?: string;

  @ApiPropertyOptional({
    description: 'Propriedades a serem retornadas na resposta',
    example: 'Title,Definition,Exclusion,Inclusion',
  })
  @IsOptional()
  @IsString()
  propertiesToBeSearchedIn?: string;

  @ApiPropertyOptional({
    description: 'Linguagem para os resultados',
    example: 'pt',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Número máximo de resultados',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Offset para paginação',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Filtro por tipo de entidade',
    example: 'category',
  })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({
    description: 'Filtro por linearização',
    example: 'mms',
  })
  @IsOptional()
  @IsString()
  linearization?: string;
}
