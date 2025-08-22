import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'domain/users/schemas/users.schema';
import { Sha256HashService } from 'infrastructure/crypto/hashers/sha256Hash.service';
import { S3ObjectService } from 'infrastructure/stores/object/s3-object.service';
import {
  MedicalCertificate,
  MedicalCertificateDocument,
} from '../schemas/medical-certificates.schema';
import { CreateMedicalCertificateDto } from '../dtos/create-medical-certificate.dto';
import { MedicalCertificateDto } from '../dtos/medical-certificate.dto';

@Injectable()
export class CreateMedicalCertificateService {
  constructor(
    @InjectModel(MedicalCertificate.name)
    private readonly medicalCertificate: Model<MedicalCertificateDocument>,
    @InjectModel(User.name)
    private readonly user: Model<UserDocument>,
    private readonly sha256HashService: Sha256HashService,
    private readonly s3ObjectService: S3ObjectService,
  ) {}

  async perform(
    data: CreateMedicalCertificateDto,
    file: Express.Multer.File,
  ): Promise<MedicalCertificateDto> {
    const medicalCertificate = new this.medicalCertificate(data);

    const [userBelongsTo, userCreatedBy] = await Promise.all([
      this.user.findOne({ id: data.userBelongsToId }),
      this.user.findOne({ id: data.userCreatedById }),
    ]);

    if (!userBelongsTo) {
      throw new NotFoundException('User belongs to not found');
    }

    if (!userCreatedBy) {
      throw new NotFoundException('User created by not found');
    }

    medicalCertificate.userBelongsToId = userBelongsTo.id;
    medicalCertificate.userCreatedById = userCreatedBy.id;

    medicalCertificate.fileHash = this.sha256HashService.hash(file.buffer);

    medicalCertificate.fileName = file.originalname;

    await this.s3ObjectService.save(
      [userBelongsTo.id, medicalCertificate.id],
      file.originalname,
      file.buffer,
    );

    const document = await medicalCertificate.save();

    return new MedicalCertificateDto({
      id: String(document.get('id')),
      number: document.number,
      verificationCode: document.verificationCode,
      icd: document.icd,
      icdVersion: document.icdVersion,
      fileName: document.fileName,
      fileHash: document.fileHash,
      status: document.status,
      userBelongsToId: document.userBelongsToId,
      userCreatedById: document.userCreatedById,
      endsAt: document.endsAt.toISOString(),
      startsAt: document.startsAt.toISOString(),
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }
}
