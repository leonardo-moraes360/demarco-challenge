import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicalCertificate,
  MedicalCertificateDocument,
} from '../schemas/medical-certificates.schema';
import { StatusEnum } from 'common/enums/status.enum';

@Injectable()
export class DeleteMedicalCertificateService {
  constructor(
    @InjectModel(MedicalCertificate.name)
    private readonly medicalCertificate: Model<MedicalCertificateDocument>,
  ) {}

  async perform(id: string): Promise<void> {
    const medicalCertificate = await this.medicalCertificate.findOneAndUpdate(
      { id },
      { $set: { status: StatusEnum.INACTIVE } },
      { new: true, runValidators: true },
    );

    if (!medicalCertificate) {
      throw new NotFoundException('Medical certificate not found');
    }
  }
}
