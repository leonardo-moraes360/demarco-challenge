import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { MedicalCertificateIncludesFieldEnum } from '../enums/medical-certificate-includes-field.enum';
import { Transform } from 'class-transformer';
import { toArray } from 'common/functions/toArray';

export class FindOneMedicalCertificateQueryDto {
  @ApiPropertyOptional({
    enum: MedicalCertificateIncludesFieldEnum,
    description: 'Campos computados opcionais para se incluir no retorno.',
    isArray: true,
  })
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsEnum(MedicalCertificateIncludesFieldEnum, { each: true })
  includes?: MedicalCertificateIncludesFieldEnum[];

  constructor(data: FindOneMedicalCertificateQueryDto) {
    Object.assign(this, data);
  }
}
