import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IcdVersionEnum } from 'common/enums/icd-version.enum';
import { StatusEnum } from 'common/enums/status.enum';
import { UserDto } from 'domain/users/dtos/user.dto';

export class MedicalCertificateDto {
  @ApiProperty({
    type: String,
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Número do atestado.',
    example: '123456789',
  })
  number: string | null;

  @ApiProperty({
    type: String,
    description: 'Código de verificação.',
    example: '4097889236a2af26c293033feb964c4cf118c0224e0d063fec0a89e9d0569ef2',
  })
  verificationCode: string | null;

  @ApiProperty({
    type: String,
    description: 'Código CID da doença ou condição do paciente.',
    example: 'E10.1',
  })
  icd: string;

  @ApiProperty({
    enum: IcdVersionEnum,
    enumName: 'IcdVersionEnum',
    description: 'Versão do código CID.',
    example: IcdVersionEnum.ICD_10,
  })
  icdVersion: IcdVersionEnum;

  @ApiProperty({
    type: String,
    description: 'O nome do arquivo do atestado médico.',
    example: 'medical-certificate.pdf',
    format: 'string',
  })
  fileName: string;

  @ApiProperty({
    type: String,
    description: 'O hash do SHA256 do arquivo para checagem de integridade.',
    example: '4097889236a2af26c293033feb964c4cf118c0224e0d063fec0a89e9d0569ef2',
    format: 'sha256',
  })
  fileHash: string;

  @ApiPropertyOptional({
    type: String,
    description: 'O link pré assinado para o arquivo do atestado médico.',
    example:
      'https://my-bucket.s3.amazonaws.com/398655d0-faf4-46cc-8031-f683bb1088c0/5fccceca-f3e3-497e-947a-1d16be09f4a9/medical-certificate.pdf',
    format: 'uri',
  })
  fileUri?: string;

  @ApiProperty({
    type: String,
    description: 'A data de início do atestado médico.',
    example: '2025-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  startsAt: string;

  @ApiProperty({
    type: String,
    description: 'A data de término do atestado médico.',
    example: '2025-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  endsAt: string;

  @ApiProperty({
    enum: StatusEnum,
    enumName: 'StatusEnum',
    description: 'O status do atestado médico.',
    example: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ApiProperty({
    type: String,
    description: 'O usuário que pertence ao atestado médico.',
    example: 'ad3988ac-99d3-48be-bb7e-ad6ea82e7002',
    format: 'uuid',
  })
  userBelongsToId: string;

  @ApiProperty({
    type: String,
    description: 'O usuário que criou o atestado médico.',
    example: '3c872d56-7966-46a0-9fd0-233e64276ead',
    format: 'uuid',
  })
  userCreatedById: string;

  @ApiPropertyOptional({
    type: UserDto,
    description: 'O usuário que pertence ao atestado médico.',
    example: '38049f82-8400-416e-a73d-1d79f10df2a6',
  })
  userBelongsTo?: UserDto;

  @ApiPropertyOptional({
    type: UserDto,
    description: 'O usuário que criou o atestado médico.',
    example: '86104c02-a3d4-4f6b-a474-2ee255266102',
  })
  userCreatedBy?: UserDto;

  @ApiProperty({
    type: String,
    description: 'Data de criação do atestado médico.',
    example: '1990-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    description: 'Data de atualização do atestado médico.',
    example: '1990-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  updatedAt: string;

  constructor(data: MedicalCertificateDto) {
    Object.assign(this, data);
  }
}
