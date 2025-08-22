import { ApiProperty } from '@nestjs/swagger';
import { MedicalCertificateDto } from './medical-certificate.dto';

export class FindAllMedicalCertificateResponseDto {
  @ApiProperty({
    description: 'O número total de atestados.',
    example: 1,
  })
  count: number;

  @ApiProperty({
    type: MedicalCertificateDto,
    description: 'A Lista de atestados.',
    isArray: true,
  })
  data: MedicalCertificateDto[];

  constructor(data: FindAllMedicalCertificateResponseDto) {
    Object.assign(this, data);
  }
}
