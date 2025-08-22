import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    type: String,
    description: 'ID do usuário',
    example: '77f483e6-de48-45cd-acfb-f04a817251c8',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Refresh token da sessão',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;

  @ApiProperty({
    type: String,
    description: 'Data de expiração da sessão',
    example: '2025-08-28T22:14:59.000Z',
  })
  @IsDateString()
  expiresAt: string;

  @ApiProperty({
    type: String,
    description: 'User agent do cliente',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    type: String,
    description: 'Endereço IP do cliente',
    example: '192.168.1.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}

export class SessionDto {
  @ApiProperty({
    type: String,
    description: 'ID da sessão',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'ID do usuário',
    example: '77f483e6-de48-45cd-acfb-f04a817251c8',
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Refresh token da sessão',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    type: String,
    description: 'Data de expiração da sessão',
    example: '2025-08-28T22:14:59.000Z',
  })
  expiresAt: string;

  @ApiProperty({
    type: String,
    description: 'User agent do cliente',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  userAgent?: string;

  @ApiProperty({
    type: String,
    description: 'Endereço IP do cliente',
    example: '192.168.1.1',
  })
  ipAddress?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Se a sessão está ativa',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: String,
    description: 'Data de revogação da sessão',
    example: '2025-08-21T22:14:59.000Z',
  })
  revokedAt?: string;

  @ApiProperty({
    type: String,
    description: 'Data de criação da sessão',
    example: '2025-08-21T22:14:59.000Z',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    description: 'Data de atualização da sessão',
    example: '2025-08-21T22:14:59.000Z',
  })
  updatedAt: string;
}

export class FindAllSessionQueryDto {
  @ApiProperty({
    type: String,
    description: 'ID do usuário para filtrar sessões',
    example: '77f483e6-de48-45cd-acfb-f04a817251c8',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Filtrar por sessões ativas',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: String,
    description: 'Página para paginação',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({
    type: String,
    description: 'Limite de itens por página',
    example: '10',
    required: false,
  })
  @IsOptional()
  @IsString()
  limit?: string;
}

export class FindAllSessionResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Total de sessões',
    example: 5,
  })
  count: number;

  @ApiProperty({
    type: [SessionDto],
    description: 'Lista de sessões',
  })
  data: SessionDto[];
}
