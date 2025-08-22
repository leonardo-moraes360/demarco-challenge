import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'domain/users/dtos/user.dto';

export class AuthResponseDto {
  @ApiProperty({
    type: String,
    description: 'Access token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Refresh token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    type: UserDto,
    description: 'Dados do usuário autenticado',
  })
  user: UserDto;

  constructor(data: AuthResponseDto) {
    Object.assign(this, data);
  }
}
