import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginateDto } from 'common/dtos/paginated.dto';
import { StatusEnum } from 'common/enums/status.enum';
import { IcdVersionEnum } from 'common/enums/icd-version.enum';

export class FindAllMedicalCertificateQueryDto extends PaginateDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Número do atestado para buscar',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  number?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Código de verificação do atestado para buscar',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  verificationCode?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Código ICD do atestado para buscar',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  icd?: string;

  @ApiPropertyOptional({
    enum: IcdVersionEnum,
    enumName: 'IcdVersionEnum',
    description: 'Versão do código ICD do atestado para buscar',
  })
  @IsOptional()
  @IsEnum(IcdVersionEnum)
  @IsNotEmpty()
  icdVersion?: IcdVersionEnum;

  @ApiPropertyOptional({
    enum: StatusEnum,
    description: 'Status do atestado para buscar',
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Data de início do atestado para buscar',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Data de fim do atestado para buscar',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'ID do usuário que pertence ao atestado para buscar',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userBelongsTo?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'ID do usuário que criou o atestado para buscar',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userCreatedBy?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Nome do usuário que pertence ao atestado para buscar',
  })
  @IsOptional()
  @IsString()
  userBelongsToName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Nome do usuário que criou o atestado para buscar',
  })
  @IsOptional()
  @IsString()
  userCreatedByName?: string;

  constructor(data: FindAllMedicalCertificateQueryDto) {
    super(data);
    Object.assign(this, data);
  }
}
