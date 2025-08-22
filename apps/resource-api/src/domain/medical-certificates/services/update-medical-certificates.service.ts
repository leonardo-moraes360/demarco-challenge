import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicalCertificate,
  MedicalCertificateDocument,
} from '../schemas/medical-certificates.schema';
import { UpdateMedicalCertificateDto } from '../dtos/update-medical-certificate.dto';
import { MedicalCertificateDto } from '../dtos/medical-certificate.dto';
import { UserDto } from 'domain/users/dtos/user.dto';

@Injectable()
export class UpdateMedicalCertificateService {
  constructor(
    @InjectModel(MedicalCertificate.name)
    private readonly medicalCertificate: Model<MedicalCertificateDocument>,
  ) {}

  async perform(
    id: string,
    data: UpdateMedicalCertificateDto,
  ): Promise<MedicalCertificateDto> {
    const updateData: any = { ...data };

    if (data.startsAt) {
      updateData.startsAt = new Date(data.startsAt);
    }
    if (data.endsAt) {
      updateData.endsAt = new Date(data.endsAt);
    }

    const medicalCertificate = await this.medicalCertificate
      .findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .populate('userBelongsTo')
      .populate('userCreatedBy');

    if (!medicalCertificate) {
      throw new NotFoundException('Medical certificate not found');
    }

    return new MedicalCertificateDto({
      id: String(medicalCertificate.get('id')),
      number: medicalCertificate.number,
      verificationCode: medicalCertificate.verificationCode,
      icd: medicalCertificate.icd,
      icdVersion: medicalCertificate.icdVersion,
      fileName: medicalCertificate.fileName,
      fileHash: medicalCertificate.fileHash,
      status: medicalCertificate.status,
      userBelongsToId: medicalCertificate.userBelongsToId,
      userCreatedById: medicalCertificate.userCreatedById,
      userBelongsTo: medicalCertificate.userBelongsTo
        ? new UserDto({
            id: String(medicalCertificate.userBelongsTo.id),
            fullName: medicalCertificate.userBelongsTo.fullName,
            email: medicalCertificate.userBelongsTo.email,
            cpf: medicalCertificate.userBelongsTo.cpf,
            position: medicalCertificate.userBelongsTo.position,
            status: medicalCertificate.userBelongsTo.status,
            birthDate: medicalCertificate.userBelongsTo.birthDate.toISOString(),
            createdAt: medicalCertificate.userBelongsTo.createdAt.toISOString(),
            updatedAt: medicalCertificate.userBelongsTo.updatedAt.toISOString(),
          })
        : undefined,
      userCreatedBy: medicalCertificate.userCreatedBy
        ? new UserDto({
            id: String(medicalCertificate.userCreatedBy.id),
            fullName: medicalCertificate.userCreatedBy.fullName,
            email: medicalCertificate.userCreatedBy.email,
            cpf: medicalCertificate.userCreatedBy.cpf,
            position: medicalCertificate.userCreatedBy.position,
            status: medicalCertificate.userCreatedBy.status,
            birthDate: medicalCertificate.userCreatedBy.birthDate.toISOString(),
            createdAt: medicalCertificate.userCreatedBy.createdAt.toISOString(),
            updatedAt: medicalCertificate.userCreatedBy.updatedAt.toISOString(),
          })
        : undefined,
      startsAt: medicalCertificate.startsAt.toISOString(),
      endsAt: medicalCertificate.endsAt.toISOString(),
      createdAt: medicalCertificate.createdAt.toISOString(),
      updatedAt: medicalCertificate.updatedAt.toISOString(),
    });
  }
}
