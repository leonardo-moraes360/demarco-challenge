import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthResponseDto } from '../dtos/health-response.dto';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  async perform(): Promise<HealthResponseDto> {
    return new HealthResponseDto(await this.health.check([]));
  }
}
