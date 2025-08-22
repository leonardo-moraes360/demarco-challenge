import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IcdEntityDto {
  @ApiProperty({
    description: 'ID único da entidade ICD',
    example: '123456789',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Título da entidade',
    example: 'Diabetes mellitus tipo 1',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Definição da entidade',
    example:
      'Diabetes mellitus caracterizado por deficiência absoluta de insulina',
  })
  definition?: string;

  @ApiPropertyOptional({
    description: 'Código ICD',
    example: 'E10',
  })
  idCode?: string;

  @ApiPropertyOptional({
    description: 'Versão do ICD',
    example: '10',
  })
  icdVersion?: string;

  @ApiPropertyOptional({
    description: 'Tipo de entidade',
    example: 'category',
  })
  entityType?: string;

  @ApiPropertyOptional({
    description: 'Classificação',
    example: 'ICD-10',
  })
  classification?: string;

  @ApiPropertyOptional({
    description: 'Exclusões',
    example: 'Diabetes mellitus tipo 2 (E11)',
  })
  exclusion?: string;

  @ApiPropertyOptional({
    description: 'Inclusões',
    example: 'Diabetes mellitus tipo 1 com complicações',
  })
  inclusion?: string;

  @ApiPropertyOptional({
    description: 'Notas',
    example: 'Incluir complicações quando especificadas',
  })
  note?: string;

  @ApiPropertyOptional({
    description: 'Sinônimos',
    example: ['DM1', 'Diabetes tipo 1'],
  })
  synonyms?: string[];

  @ApiPropertyOptional({
    description: 'Termos relacionados',
    example: ['Insulina', 'Glicemia'],
  })
  relatedTerms?: string[];
}

export class IcdSearchResponseDto {
  @ApiProperty({
    description: 'Lista de entidades ICD encontradas',
    type: [IcdEntityDto],
  })
  entities: IcdEntityDto[];

  @ApiPropertyOptional({
    description: 'Total de resultados encontrados',
    example: 150,
  })
  totalCount?: number;

  @ApiPropertyOptional({
    description: 'Offset atual',
    example: 0,
  })
  offset?: number;

  @ApiPropertyOptional({
    description: 'Limite de resultados',
    example: 10,
  })
  limit?: number;
}
