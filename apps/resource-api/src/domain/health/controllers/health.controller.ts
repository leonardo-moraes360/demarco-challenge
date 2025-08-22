import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';
import { HealthResponseDto } from '../dtos/health-response.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Retorna a saúde da aplicação',
    description:
      'Retorna a saúde da aplicação, com informações detalhadas sobre os serviços associados.',
  })
  @HealthCheck({ noCache: true })
  @Get()
  health(): Promise<HealthResponseDto> {
    return this.healthService.perform();
  }
}
