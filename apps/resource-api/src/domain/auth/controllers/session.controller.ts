import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SessionService } from '../services/session.service';
import {
  FindAllSessionQueryDto,
  FindAllSessionResponseDto,
  SessionDto,
} from '../dtos/session.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from 'domain/users/schemas/users.schema';

@ApiTags('Sessões')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as sessões' })
  @ApiResponse({
    status: 200,
    description: 'Sessões listadas com sucesso',
    type: FindAllSessionResponseDto,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'ID do usuário para filtrar',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por sessões ativas',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Limite de itens por página',
  })
  async findAllSessions(
    @Query() query: FindAllSessionQueryDto,
    @CurrentUser() user: User,
  ): Promise<FindAllSessionResponseDto> {
    if (!query.userId) {
      query.userId = user.id;
    }

    return this.sessionService.findAllSessions(query);
  }

  @Get('my-sessions')
  @ApiOperation({ summary: 'Obter sessões do usuário atual' })
  @ApiResponse({
    status: 200,
    description: 'Sessões do usuário obtidas com sucesso',
    type: [SessionDto],
  })
  async getMySessions(@CurrentUser() user: User): Promise<SessionDto[]> {
    return this.sessionService.findUserSessions(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter sessão por ID' })
  @ApiResponse({
    status: 200,
    description: 'Sessão obtida com sucesso',
    type: SessionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sessão não encontrada',
  })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  async findSessionById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SessionDto> {
    const session = await this.sessionService.findSessionById(id);

    if (session.userId !== user.id) {
      throw new UnauthorizedException('Access denied');
    }

    return session;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revogar sessão' })
  @ApiResponse({
    status: 204,
    description: 'Sessão revogada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Sessão não encontrada',
  })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  async revokeSession(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.sessionService.revokeSession(id, user.id);
  }

  @Delete('my-sessions/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Revogar todas as sessões do usuário exceto a atual',
  })
  @ApiResponse({
    status: 204,
    description: 'Todas as sessões revogadas com sucesso',
  })
  async revokeAllMySessions(
    @CurrentUser() user: User,
    @Request() req: any,
  ): Promise<void> {
    const currentSessionId = req.user.sessionId;
    await this.sessionService.revokeAllUserSessions(user.id, currentSessionId);
  }

  @Delete('my-sessions/others')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revogar todas as outras sessões do usuário' })
  @ApiResponse({
    status: 204,
    description: 'Outras sessões revogadas com sucesso',
  })
  async revokeOtherSessions(
    @CurrentUser() user: User,
    @Request() req: any,
  ): Promise<void> {
    const currentSessionId = req.user.sessionId;
    await this.sessionService.revokeAllUserSessions(user.id, currentSessionId);
  }

  @Get('stats/active-count')
  @ApiOperation({
    summary: 'Obter contagem de sessões ativas do usuário atual',
  })
  @ApiResponse({
    status: 200,
    description: 'Contagem de sessões ativas obtida com sucesso',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 3,
        },
      },
    },
  })
  async getActiveSessionCount(
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    const count = await this.sessionService.getActiveSessionCount(user.id);
    return { count };
  }
}
