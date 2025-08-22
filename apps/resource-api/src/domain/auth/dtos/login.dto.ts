import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'Email do usuário',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Senha do usuário',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(data: LoginDto) {
    Object.assign(this, data);
  }
}
