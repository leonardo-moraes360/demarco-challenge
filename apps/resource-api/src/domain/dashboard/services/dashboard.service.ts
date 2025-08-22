import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'domain/users/schemas/users.schema';
import { Session } from 'domain/auth/schemas/session.schema';
import { MedicalCertificate } from 'domain/medical-certificates/schemas/medical-certificates.schema';
import { StatusEnum } from 'common/enums/status.enum';
import {
  DashboardMetricsDto,
  UserMetricsDto,
  SessionMetricsDto,
  MedicalCertificateMetricsDto,
} from '../dtos/dashboard-metrics.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    @InjectModel(MedicalCertificate.name)
    private medicalCertificateModel: Model<MedicalCertificate>,
  ) {}

  async getMetrics(): Promise<DashboardMetricsDto> {
    const [userMetrics, sessionMetrics, medicalCertificateMetrics] =
      await Promise.all([
        this.getUserMetrics(),
        this.getSessionMetrics(),
        this.getMedicalCertificateMetrics(),
      ]);

    return {
      users: userMetrics,
      sessions: sessionMetrics,
      medicalCertificates: medicalCertificateMetrics,
      lastUpdated: new Date(),
    };
  }

  private async getUserMetrics(): Promise<UserMetricsDto> {
    const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ status: StatusEnum.ACTIVE }),
      this.userModel.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      newUsersThisMonth,
    };
  }

  private async getSessionMetrics(): Promise<SessionMetricsDto> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      activeSessions,
      expiredSessions,
      revokedSessions,
      sessionsCreatedToday,
    ] = await Promise.all([
      this.sessionModel.countDocuments({
        isActive: true,
        expiresAt: { $gt: now },
      }),
      this.sessionModel.countDocuments({
        expiresAt: { $lte: now },
      }),
      this.sessionModel.countDocuments({
        isActive: false,
        revokedAt: { $exists: true },
      }),
      this.sessionModel.countDocuments({
        createdAt: { $gte: today },
      }),
    ]);

    return {
      activeSessions,
      expiredSessions,
      revokedSessions,
      sessionsCreatedToday,
    };
  }

  private async getMedicalCertificateMetrics(): Promise<MedicalCertificateMetricsDto> {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCertificates,
      activeCertificates,
      certificatesCreatedThisMonth,
      certificatesExpiringIn7Days,
    ] = await Promise.all([
      this.medicalCertificateModel.countDocuments(),
      this.medicalCertificateModel.countDocuments({
        status: StatusEnum.ACTIVE,
      }),
      this.medicalCertificateModel.countDocuments({
        createdAt: { $gte: firstDayOfMonth },
      }),
      this.medicalCertificateModel.countDocuments({
        status: StatusEnum.ACTIVE,
        endsAt: {
          $gte: now,
          $lte: sevenDaysFromNow,
        },
      }),
    ]);

    return {
      totalCertificates,
      activeCertificates,
      inactiveCertificates: totalCertificates - activeCertificates,
      certificatesCreatedThisMonth,
      certificatesExpiringIn7Days,
    };
  }
}
