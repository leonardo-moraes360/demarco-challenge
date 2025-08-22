import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class FindAllUserResponseDto {
  @ApiProperty({
    description: 'O número total de usuários.',
    example: 1,
  })
  count: number;

  @ApiProperty({
    type: UserDto,
    description: 'A Lista de usuários.',
    isArray: true,
  })
  data: UserDto[];

  constructor(data: FindAllUserResponseDto) {
    Object.assign(this, data);
  }
}
