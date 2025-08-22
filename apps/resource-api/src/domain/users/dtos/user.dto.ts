import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from 'common/enums/status.enum';

export class UserDto {
  @ApiProperty({
    type: String,
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Nome do usuário',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'Email do usuário',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'CPF do usuário',
    example: '123.456.789-00',
    format: 'cpf',
  })
  cpf: string;

  @ApiProperty({
    type: String,
    description: 'Cargo do usuário',
    example: 'Desenvolvedor',
  })
  position: string;

  @ApiProperty({
    type: String,
    description: 'Nascimento do usuário',
    example: '1990-01-01T00:00:00.000Z',
  })
  birthDate: string;

  @ApiProperty({
    enum: StatusEnum,
    enumName: 'StatusEnum',
    description: 'Status do usuário',
    example: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ApiProperty({
    type: String,
    description: 'Data de criação do usuário',
    example: '1990-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    description: 'Data de atualização do usuário',
    example: '1990-01-01T00:00:00.000Z',
  })
  updatedAt: string;

  constructor(data: UserDto) {
    Object.assign(this, data);
  }
}
