export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
}

export interface SessionMetrics {
  activeSessions: number;
  expiredSessions: number;
  revokedSessions: number;
  sessionsCreatedToday: number;
}

export interface MedicalCertificateMetrics {
  totalCertificates: number;
  activeCertificates: number;
  inactiveCertificates: number;
  certificatesCreatedThisMonth: number;
  certificatesExpiringIn7Days: number;
}

export interface DashboardMetrics {
  users: UserMetrics;
  sessions: SessionMetrics;
  medicalCertificates: MedicalCertificateMetrics;
  lastUpdated: string;
}
