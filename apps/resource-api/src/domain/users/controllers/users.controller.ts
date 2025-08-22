import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindOneUserService } from '../services/find-one-user.service';
import { FindAllUserService } from '../services/find-all-user.service';
import { FindAllUserQueryDto } from '../dtos/find-all-user-query.dto';
import { FindAllUserResponseDto } from '../dtos/find-all-user-response.dto';
import { UpdateUserService } from '../services/update-user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { DeleteUserService } from '../services/delete-user.service';
import { UserDto } from '../dtos/user.dto';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findOneUserService: FindOneUserService,
    private readonly findAllUserService: FindAllUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: 'Cria um novo usuário com os dados fornecidos.',
  })
  @ApiCreatedResponse({
    type: UserDto,
    description: 'Usuário criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Erro ao criar usuário. Verifique os dados fornecidos.',
  })
  @Post()
  create(@Body() data: CreateUserDto): Promise<UserDto> {
    return this.createUserService.perform(data);
  }

  @ApiOperation({
    summary: 'Busca um usuário',
    description: 'Busca um usuário pelo ID fornecido.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID do usuário',
    required: true,
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Usuário encontrado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserDto> {
    return this.findOneUserService.perform(id);
  }

  @ApiOperation({
    summary: 'Lista usuários',
    description:
      'Lista todos os usuários cadastrados pelos filtros fornecidos.',
  })
  @ApiOkResponse({
    type: FindAllUserResponseDto,
    description: 'Usuários encontrados com sucesso.',
  })
  @Get()
  findAll(
    @Query() params: FindAllUserQueryDto,
  ): Promise<FindAllUserResponseDto> {
    return this.findAllUserService.perform(params);
  }

  @ApiOperation({
    summary: 'Atualiza usuário',
    description: 'Atualiza um usuário pelo ID fornecido.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID do usuário',
    required: true,
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'Usuário atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Erro ao atualizar usuário. Verifique os dados fornecidos.',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserDto> {
    return this.updateUserService.perform(id, data);
  }

  @ApiOperation({
    summary: 'Deleta usuário',
    description: 'Deleta um usuário pelo ID fornecido.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID do usuário',
    required: true,
  })
  @ApiNoContentResponse({
    description: 'Usuário deletado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleted(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.deleteUserService.perform(id);
  }
}
