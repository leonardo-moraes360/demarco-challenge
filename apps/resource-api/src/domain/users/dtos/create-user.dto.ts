import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsCPF } from 'common/decorators/is-cpf.decorator';
import { unmaskCpf } from 'common/functions/unmask-cpf';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'Nome do usuário',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'Email do usuário',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Senha do usuário',
    example: 'supersecretpassword',
    format: 'password',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    type: String,
    description: 'CPF do usuário',
    example: '123.456.789-00',
    format: 'cpf',
  })
  @Transform(unmaskCpf)
  @IsCPF()
  cpf: string;

  @ApiProperty({
    type: String,
    description: 'Cargo do usuário',
    example: 'Desenvolvedor',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    type: String,
    description: 'Nascimento do usuário',
    example: '1990-01-01',
  })
  @IsDateString()
  birthDate: string;
}
