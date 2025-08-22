import { Module } from '@nestjs/common';
import { HealthModule } from './health.module';
import { UsersModule } from './users.module';
import { MedicalCertificateModule } from './medical-certificate.module';
import { IcdModule } from './icd.module';
import { AuthModule } from './auth.module';
import { DashboardModule } from './dashboard.module';

@Module({
  imports: [
    HealthModule,
    UsersModule,
    MedicalCertificateModule,
    IcdModule,
    AuthModule,
    DashboardModule,
  ],
})
export class LoaderModule {}
