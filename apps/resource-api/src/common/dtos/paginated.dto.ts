import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsPositive, IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginateDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'O número da página a ser recuperada.',
    format: 'integer',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'A quantidade de itens por página.',
    format: 'integer',
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  page_size?: number = 10;

  constructor(data: PaginateDto) {
    Object.assign(this, data);
  }
}
