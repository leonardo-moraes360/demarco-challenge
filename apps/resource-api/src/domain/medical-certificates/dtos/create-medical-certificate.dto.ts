import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IcdVersionEnum } from 'common/enums/icd-version.enum';

export class CreateMedicalCertificateDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Número do atestado.',
    example: '123456789',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  number: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Código de verificação.',
    example: '4097889236a2af26c293033feb964c4cf118c0224e0d063fec0a89e9d0569ef2',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  verificationCode: string | null;

  @ApiProperty({
    type: String,
    description: 'Código CID da doença ou condição do paciente.',
    example: 'E10.1',
  })
  @IsString()
  @IsNotEmpty()
  icd: string;

  @ApiProperty({
    enum: IcdVersionEnum,
    enumName: 'IcdVersionEnum',
    description: 'Versão do código CID.',
    example: IcdVersionEnum.ICD_10,
  })
  @IsEnum(IcdVersionEnum)
  icdVersion: IcdVersionEnum;

  @ApiProperty({
    type: 'string',
    description: 'Arquivo do atestado médico.',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;

  @ApiProperty({
    type: String,
    description: 'A data de início do atestado médico.',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startsAt: string;

  @ApiProperty({
    type: String,
    description: 'A data de término do atestado médico.',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  endsAt: string;

  @ApiProperty({
    type: String,
    description: 'O usuário que pertence ao atestado médico.',
    example: '38049f82-8400-416e-a73d-1d79f10df2a6',
    format: 'uuid',
  })
  @IsUUID()
  userBelongsToId: string;

  @ApiProperty({
    type: String,
    description: 'O usuário que criou o atestado médico.',
    example: '86104c02-a3d4-4f6b-a474-2ee255266102',
    format: 'uuid',
  })
  @IsUUID()
  userCreatedById: string;
}
