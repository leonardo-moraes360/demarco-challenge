import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { StatusEnum } from 'common/enums/status.enum';
import { IcdVersionEnum } from 'common/enums/icd-version.enum';
import { User } from 'domain/users/schemas/users.schema';

export type MedicalCertificateDocument = HydratedDocument<MedicalCertificate>;

@Schema({ collection: 'medical_certificates', timestamps: true })
export class MedicalCertificate {
  @Prop({
    required: true,
    unique: true,
    index: true,
    default: uuidv4,
  })
  id: string;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  number: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  verificationCode: string | null;

  @Prop({
    type: String,
    required: true,
  })
  icd: string;

  @Prop({
    enum: IcdVersionEnum,
    required: true,
  })
  icdVersion: IcdVersionEnum;

  @Prop({
    type: String,
    required: true,
  })
  fileHash: string;

  @Prop({
    type: String,
    required: true,
  })
  fileName: string;

  @Prop({
    type: Date,
    required: true,
  })
  startsAt: Date;

  @Prop({
    type: Date,
    required: true,
  })
  endsAt: Date;

  @Prop({
    type: String,
    enum: StatusEnum,
    required: true,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Prop({
    type: String,
    required: true,
  })
  userBelongsToId: string;

  @Prop({
    type: String,
    required: true,
  })
  userCreatedById: string;

  userBelongsTo: User;

  userCreatedBy: User;

  createdAt: Date;

  updatedAt: Date;
}

export const MedicalCertificateSchema =
  SchemaFactory.createForClass(MedicalCertificate);

MedicalCertificateSchema.virtual('userBelongsTo', {
  ref: 'User',
  localField: 'userBelongsToId',
  foreignField: 'id',
  justOne: true,
});

MedicalCertificateSchema.virtual('userCreatedBy', {
  ref: 'User',
  localField: 'userCreatedById',
  foreignField: 'id',
  justOne: true,
});

MedicalCertificateSchema.set('toJSON', { virtuals: true });

MedicalCertificateSchema.set('toObject', { virtuals: true });
