import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'domain/auth/guards/jwt-auth.guard';
import { DashboardService } from '../services/dashboard.service';
import { DashboardMetricsDto } from '../dtos/dashboard-metrics.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Obtém métricas do dashboard',
    description:
      'Retorna métricas consolidadas de usuários, sessões e atestados médicos.',
  })
  @ApiOkResponse({
    type: DashboardMetricsDto,
    description: 'Métricas do dashboard obtidas com sucesso.',
  })
  @Get('metrics')
  getMetrics(): Promise<DashboardMetricsDto> {
    return this.dashboardService.getMetrics();
  }
}
