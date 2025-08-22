import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicalCertificate,
  MedicalCertificateDocument,
} from '../schemas/medical-certificates.schema';
import { MedicalCertificateDto } from '../dtos/medical-certificate.dto';
import { FindAllMedicalCertificateResponseDto } from '../dtos/find-all-medical-certificate-response.dto';
import { FindAllMedicalCertificateQueryDto } from '../dtos/find-all-medical-certificate-query.dto';
import { UserDto } from 'domain/users/dtos/user.dto';
import { User } from 'domain/users/schemas/users.schema';

@Injectable()
export class FindAllMedicalCertificateService {
  constructor(
    @InjectModel(MedicalCertificate.name)
    private readonly medicalCertificate: Model<MedicalCertificateDocument>,
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async perform(
    params: FindAllMedicalCertificateQueryDto,
  ): Promise<FindAllMedicalCertificateResponseDto> {
    const { page = 1, page_size = 10, ...filters } = params;

    const query: any = {
      ...(filters?.number && {
        number: {
          $regex: filters.number,
          $options: 'i',
        },
      }),
      ...(filters?.verificationCode && {
        verificationCode: filters.verificationCode,
      }),
      ...(filters?.icd && {
        icd: {
          $regex: filters.icd,
          $options: 'i',
        },
      }),
      ...(filters?.icdVersion && { icdVersion: filters.icdVersion }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startsAt && {
        startsAt: { $gte: new Date(filters.startsAt) },
      }),
      ...(filters?.endsAt && { endsAt: { $lte: new Date(filters.endsAt) } }),
      ...(filters?.userBelongsTo && { userBelongsToId: filters.userBelongsTo }),
      ...(filters?.userCreatedBy && { userCreatedById: filters.userCreatedBy }),
    };

    // Handle user name searches
    if (filters?.userBelongsToName || filters?.userCreatedByName) {
      const userQuery: any = {};

      if (filters.userBelongsToName) {
        const belongsToUsers = await this.user
          .find({
            fullName: { $regex: filters.userBelongsToName, $options: 'i' },
          })
          .select('id');
        const belongsToUserIds = belongsToUsers.map((user) => user.id);
        if (belongsToUserIds.length > 0) {
          query.userBelongsToId = { $in: belongsToUserIds };
        } else {
          // If no users found, return empty result
          query.userBelongsToId = { $in: [] };
        }
      }

      if (filters.userCreatedByName) {
        const createdByUsers = await this.user
          .find({
            fullName: { $regex: filters.userCreatedByName, $options: 'i' },
          })
          .select('id');
        const createdByUserIds = createdByUsers.map((user) => user.id);
        if (createdByUserIds.length > 0) {
          query.userCreatedById = { $in: createdByUserIds };
        } else {
          // If no users found, return empty result
          query.userCreatedById = { $in: [] };
        }
      }
    }

    const [count, data] = await Promise.all([
      this.medicalCertificate.countDocuments(query),
      this.medicalCertificate
        .find(query)
        .populate('userBelongsTo')
        .populate('userCreatedBy')
        .skip((page - 1) * page_size)
        .limit(page_size)
        .sort({ createdAt: -1 }),
    ]);

    return new FindAllMedicalCertificateResponseDto({
      count,
      data: data.map(
        (medicalCertificate) =>
          new MedicalCertificateDto({
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
                  birthDate:
                    medicalCertificate.userBelongsTo.birthDate.toISOString(),
                  createdAt:
                    medicalCertificate.userBelongsTo.createdAt.toISOString(),
                  updatedAt:
                    medicalCertificate.userBelongsTo.updatedAt.toISOString(),
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
                  birthDate:
                    medicalCertificate.userCreatedBy.birthDate.toISOString(),
                  createdAt:
                    medicalCertificate.userCreatedBy.createdAt.toISOString(),
                  updatedAt:
                    medicalCertificate.userCreatedBy.updatedAt.toISOString(),
                })
              : undefined,
            startsAt: medicalCertificate.startsAt.toISOString(),
            endsAt: medicalCertificate.endsAt.toISOString(),
            createdAt: medicalCertificate.createdAt.toISOString(),
            updatedAt: medicalCertificate.updatedAt.toISOString(),
          }),
      ),
    });
  }
}
