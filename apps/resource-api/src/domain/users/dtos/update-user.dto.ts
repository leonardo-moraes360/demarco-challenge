import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsCPF } from 'common/decorators/is-cpf.decorator';
import { unmaskCpf } from 'common/functions/unmask-cpf';
import { StatusEnum } from 'common/enums/status.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Nome do usuário',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Email do usuário',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Senha do usuário',
    example: 'supersecretpassword',
    format: 'password',
  })
  @IsOptional()
  @IsStrongPassword()
  password: string;

  @ApiPropertyOptional({
    type: String,
    description: 'CPF do usuário',
    example: '123.456.789-00',
    format: 'cpf',
  })
  @IsOptional()
  @Transform(unmaskCpf)
  @IsCPF()
  cpf: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Cargo do usuário',
    example: 'Desenvolvedor',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Nascimento do usuário',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({
    enum: StatusEnum,
    enumName: 'StatusEnum',
    description: 'Status do usuário',
    example: StatusEnum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
