import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { genSalt, hash } from 'bcrypt';
import { StatusEnum } from 'common/enums/status.enum';
import { MedicalCertificate } from 'domain/medical-certificates/schemas/medical-certificates.schema';

export type UserDocument = HydratedDocument<User>;

export const USER_SCHEMA_NAME = 'User';

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    index: true,
    default: uuidv4,
  })
  id: string;

  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
    unique: true,
  })
  cpf: string;

  @Prop({
    required: true,
  })
  position: string;

  @Prop({
    type: Date,
    required: true,
  })
  birthDate: Date;

  @Prop({
    type: String,
    enum: StatusEnum,
    required: true,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  medicalCertificates: MedicalCertificate[];

  createdMedicalCertificates: MedicalCertificate[];

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const salt = await genSalt(12);

  this.passwordHash = await hash(this.passwordHash, salt);

  next();
});

UserSchema.virtual('medicalCertificates', {
  ref: MedicalCertificate.name,
  localField: 'id',
  foreignField: 'userBelongsToId',
  justOne: false,
});

UserSchema.virtual('createdMedicalCertificates', {
  ref: MedicalCertificate.name,
  localField: 'id',
  foreignField: 'userCreatedById',
  justOne: false,
});

UserSchema.set('toJSON', { virtuals: true });

UserSchema.set('toObject', { virtuals: true });
