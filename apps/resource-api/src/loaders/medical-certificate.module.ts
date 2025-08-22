import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MedicalCertificatesController } from 'domain/medical-certificates/controllers/medical-certificates.controller';
import { CreateMedicalCertificateService } from 'domain/medical-certificates/services/create-medical-certificate.service';
import { FindOneMedicalCertificateService } from 'domain/medical-certificates/services/find-one-medical-certificates.service';
import { FindAllMedicalCertificateService } from 'domain/medical-certificates/services/find-all-medical-certificates.service';
import { UpdateMedicalCertificateService } from 'domain/medical-certificates/services/update-medical-certificates.service';
import { DeleteMedicalCertificateService } from 'domain/medical-certificates/services/delete-medical-certificate.service';
import { Sha256HashService } from 'infrastructure/crypto/hashers/sha256Hash.service';
import { S3ObjectService } from 'infrastructure/stores/object/s3-object.service';
import {
  MedicalCertificate,
  MedicalCertificateSchema,
} from 'domain/medical-certificates/schemas/medical-certificates.schema';
import { User, UserSchema } from 'domain/users/schemas/users.schema';
import { store } from 'common/configs/store';

@Module({
  imports: [
    ConfigModule.forFeature(store),
    MongooseModule.forFeature([
      {
        name: MedicalCertificate.name,
        schema: MedicalCertificateSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [MedicalCertificatesController],
  providers: [
    CreateMedicalCertificateService,
    FindOneMedicalCertificateService,
    FindAllMedicalCertificateService,
    UpdateMedicalCertificateService,
    DeleteMedicalCertificateService,
    Sha256HashService,
    S3ObjectService,
  ],
})
export class MedicalCertificateModule {}
