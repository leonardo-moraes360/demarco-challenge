import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IcdVersionEnum } from 'common/enums/icd-version.enum';

export class UpdateMedicalCertificateDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Número do atestado.',
    example: '123456789',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  number?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Código de verificação.',
    example: '4097889236a2af26c293033feb964c4cf118c0224e0d063fec0a89e9d0569ef2',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  verificationCode?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Código CID da doença ou condição do paciente.',
    example: 'E10.1',
  })
  @IsString()
  @IsNotEmpty()
  icd?: string;

  @ApiPropertyOptional({
    enum: IcdVersionEnum,
    enumName: 'IcdVersionEnum',
    description: 'Versão do código CID.',
    example: IcdVersionEnum.ICD_10,
  })
  @IsEnum(IcdVersionEnum)
  icdVersion?: IcdVersionEnum;

  @ApiPropertyOptional({
    type: String,
    description: 'A data de início do atestado médico.',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'A data de término do atestado médico.',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  endsAt?: string;
}
