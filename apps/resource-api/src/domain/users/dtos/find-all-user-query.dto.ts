import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { unmaskCpf } from 'common/functions/unmask-cpf';
import { PaginateDto } from 'common/dtos/paginated.dto';
import { StatusEnum } from 'common/enums/status.enum';

export class FindAllUserQueryDto extends PaginateDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Nome do usuário para buscar',
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'CPF do usuário para buscar',
  })
  @IsOptional()
  @Transform(unmaskCpf)
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    enum: StatusEnum,
    description: 'Status do usuário para buscar',
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: string;

  constructor(data: FindAllUserQueryDto) {
    super(data);
    Object.assign(this, data);
  }
}
