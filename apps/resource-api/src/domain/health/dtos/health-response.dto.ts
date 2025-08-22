import { ApiProperty } from '@nestjs/swagger';
import {
  type HealthCheckStatus,
  type HealthIndicatorResult,
  type HealthCheckResult,
} from '@nestjs/terminus';

export class HealthIndicatorResultDto implements HealthIndicatorResult {
  @ApiProperty({
    enum: ['up', 'down'],
    enumName: 'HealthCheckStatus',
    description: 'O status da verificação de saúde.',
    example: 'up',
  })
  status: HealthCheckStatus;

  [key: string]: any;

  constructor(data: HealthResponseDto) {
    Object.assign(this, data);
  }
}

export class HealthResponseDto implements HealthCheckResult {
  @ApiProperty({
    enum: ['error', 'ok', 'shutting_down'],
    enumName: 'HealthCheckStatus',
    description: 'Os status da verificação de saúde.',
    example: 'ok',
  })
  status: HealthCheckStatus;

  @ApiProperty({
    type: HealthIndicatorResultDto,
    description: 'Os detalhes da verificação de saúde.',
  })
  details: HealthIndicatorResult;

  @ApiProperty({
    type: HealthIndicatorResultDto,
    description: 'Os erros da verificação de saúde.',
  })
  error?: HealthIndicatorResult | undefined;

  @ApiProperty({
    type: HealthIndicatorResultDto,
    description: 'Os informações da verificação de saúde.',
  })
  info?: HealthIndicatorResult | undefined;

  constructor(data: HealthResponseDto) {
    Object.assign(this, data);
  }
}
