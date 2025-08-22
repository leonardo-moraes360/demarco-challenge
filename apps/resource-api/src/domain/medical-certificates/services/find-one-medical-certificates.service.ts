import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusEnum } from 'common/enums/status.enum';
import {
  MedicalCertificate,
  MedicalCertificateDocument,
} from '../schemas/medical-certificates.schema';
import { User, UserDocument } from 'domain/users/schemas/users.schema';
import { S3ObjectService } from 'infrastructure/stores/object/s3-object.service';
import { MedicalCertificateIncludesFieldEnum } from '../enums/medical-certificate-includes-field.enum';
import { FindOneMedicalCertificateQueryDto } from '../dtos/find-one-medical-certificate-query.dto';
import { MedicalCertificateDto } from '../dtos/medical-certificate.dto';
import { UserDto } from 'domain/users/dtos/user.dto';

@Injectable()
export class FindOneMedicalCertificateService {
  constructor(
    @InjectModel(MedicalCertificate.name)
    private readonly medicalCertificate: Model<MedicalCertificateDocument>,
    @InjectModel(User.name)
    private readonly user: Model<UserDocument>,
    private readonly s3ObjectService: S3ObjectService,
  ) {}

  async perform(
    id: string,
    params: FindOneMedicalCertificateQueryDto,
  ): Promise<MedicalCertificateDto> {
    const medicalCertificate = await this.medicalCertificate.findOne({
      id,
    });

    if (!medicalCertificate) {
      throw new NotFoundException('Medical certificate not found');
    }

    let fileUri: string | null = null;

    if (
      params.includes?.includes(MedicalCertificateIncludesFieldEnum.fileUri)
    ) {
      fileUri = await this.s3ObjectService.getPreSignedUrl(
        [medicalCertificate.userBelongsToId, medicalCertificate.id],
        medicalCertificate.fileName,
      );
    }

    if (
      params.includes?.includes(
        MedicalCertificateIncludesFieldEnum.userBelongsTo,
      )
    ) {
      await medicalCertificate.populate({
        path: 'userBelongsTo',
        select:
          'id fullName email cpf position status birthDate createdAt updatedAt',
      });
    }

    if (
      params.includes?.includes(
        MedicalCertificateIncludesFieldEnum.userCreatedBy,
      )
    ) {
      await medicalCertificate.populate({
        path: 'userCreatedBy',
        select:
          'id fullName email cpf position status birthDate createdAt updatedAt',
      });
    }

    return new MedicalCertificateDto({
      ...(fileUri && { fileUri }),
      ...(medicalCertificate.userBelongsTo && {
        userBelongsTo: new UserDto({
          id: medicalCertificate.userBelongsTo.id,
          fullName: medicalCertificate.userBelongsTo.fullName,
          email: medicalCertificate.userBelongsTo.email,
          cpf: medicalCertificate.userBelongsTo.cpf,
          position: medicalCertificate.userBelongsTo.position,
          status: medicalCertificate.userBelongsTo.status,
          birthDate: medicalCertificate.userBelongsTo.birthDate.toISOString(),
          createdAt: medicalCertificate.userBelongsTo.createdAt.toISOString(),
          updatedAt: medicalCertificate.userBelongsTo.updatedAt.toISOString(),
        }),
      }),
      ...(medicalCertificate.userCreatedBy && {
        userCreatedBy: new UserDto({
          id: medicalCertificate.userCreatedBy.id,
          fullName: medicalCertificate.userCreatedBy.fullName,
          email: medicalCertificate.userCreatedBy.email,
          cpf: medicalCertificate.userCreatedBy.cpf,
          position: medicalCertificate.userCreatedBy.position,
          status: medicalCertificate.userCreatedBy.status,
          birthDate: medicalCertificate.userCreatedBy.birthDate.toISOString(),
          createdAt: medicalCertificate.userCreatedBy.createdAt.toISOString(),
          updatedAt: medicalCertificate.userCreatedBy.updatedAt.toISOString(),
        }),
      }),
      id: String(medicalCertificate.get('id')),
      number: medicalCertificate.number,
      verificationCode: medicalCertificate.verificationCode,
      icd: medicalCertificate.icd,
      icdVersion: medicalCertificate.icdVersion,
      fileHash: medicalCertificate.fileHash,
      fileName: medicalCertificate.fileName,
      status: medicalCertificate.status,
      userBelongsToId: medicalCertificate.userBelongsToId,
      userCreatedById: medicalCertificate.userCreatedById,
      startsAt: medicalCertificate.startsAt.toISOString(),
      endsAt: medicalCertificate.endsAt.toISOString(),
      createdAt: medicalCertificate.createdAt.toISOString(),
      updatedAt: medicalCertificate.updatedAt.toISOString(),
    });
  }
}
