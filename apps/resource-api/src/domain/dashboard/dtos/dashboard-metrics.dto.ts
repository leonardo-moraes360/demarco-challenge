import { ApiProperty } from '@nestjs/swagger';

export class UserMetricsDto {
  @ApiProperty({
    description: 'Total de usuários cadastrados',
    example: 150,
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Usuários ativos',
    example: 142,
  })
  activeUsers: number;

  @ApiProperty({
    description: 'Usuários inativos',
    example: 8,
  })
  inactiveUsers: number;

  @ApiProperty({
    description: 'Novos usuários no último mês',
    example: 12,
  })
  newUsersThisMonth: number;
}

export class SessionMetricsDto {
  @ApiProperty({
    description: 'Total de sessões ativas',
    example: 89,
  })
  activeSessions: number;

  @ApiProperty({
    description: 'Sessões expiradas',
    example: 23,
  })
  expiredSessions: number;

  @ApiProperty({
    description: 'Sessões revogadas',
    example: 15,
  })
  revokedSessions: number;

  @ApiProperty({
    description: 'Sessões criadas hoje',
    example: 5,
  })
  sessionsCreatedToday: number;
}

export class MedicalCertificateMetricsDto {
  @ApiProperty({
    description: 'Total de atestados médicos',
    example: 456,
  })
  totalCertificates: number;

  @ApiProperty({
    description: 'Atestados ativos',
    example: 423,
  })
  activeCertificates: number;

  @ApiProperty({
    description: 'Atestados inativos',
    example: 33,
  })
  inactiveCertificates: number;

  @ApiProperty({
    description: 'Atestados criados este mês',
    example: 45,
  })
  certificatesCreatedThisMonth: number;

  @ApiProperty({
    description: 'Atestados que expiram em 7 dias',
    example: 12,
  })
  certificatesExpiringIn7Days: number;
}

export class DashboardMetricsDto {
  @ApiProperty({
    description: 'Métricas de usuários',
    type: UserMetricsDto,
  })
  users: UserMetricsDto;

  @ApiProperty({
    description: 'Métricas de sessões',
    type: SessionMetricsDto,
  })
  sessions: SessionMetricsDto;

  @ApiProperty({
    description: 'Métricas de atestados médicos',
    type: MedicalCertificateMetricsDto,
  })
  medicalCertificates: MedicalCertificateMetricsDto;

  @ApiProperty({
    description: 'Data e hora da última atualização',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastUpdated: Date;
}
