import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from 'domain/dashboard/controllers/dashboard.controller';
import { DashboardService } from 'domain/dashboard/services/dashboard.service';
import { User, UserSchema } from 'domain/users/schemas/users.schema';
import { Session, SessionSchema } from 'domain/auth/schemas/session.schema';
import {
  MedicalCertificate,
  MedicalCertificateSchema,
} from 'domain/medical-certificates/schemas/medical-certificates.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: MedicalCertificate.name, schema: MedicalCertificateSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
