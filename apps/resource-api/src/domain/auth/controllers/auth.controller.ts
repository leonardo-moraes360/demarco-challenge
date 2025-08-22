import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from 'domain/users/schemas/users.schema';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica o usuário e retorna tokens de acesso.',
  })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Login realizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Dados de login inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    return this.authService.login(req.user, userAgent, ipAddress);
  }

  @ApiOperation({
    summary: 'Renovar access token',
    description: 'Renova o access token usando o refresh token.',
  })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Token renovado com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido.',
  })
  @Post('refresh')
  async refresh(
    @Request() req,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;
    return this.authService.refreshToken(
      refreshTokenDto.refreshToken,
      userAgent,
      ipAddress,
    );
  }

  @ApiOperation({
    summary: 'Fazer logout',
    description: 'Revoga a sessão atual do usuário.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req, @CurrentUser() user: User): Promise<void> {
    const sessionId = req.user.sessionId;
    await this.authService.logout(sessionId, user.id);
  }

  @ApiOperation({
    summary: 'Fazer logout de todas as sessões',
    description: 'Revoga todas as sessões do usuário.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@CurrentUser() user: User): Promise<void> {
    await this.authService.logoutAllSessions(user.id);
  }
}
