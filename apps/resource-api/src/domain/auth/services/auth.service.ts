import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';
import { User, UserDocument } from 'domain/users/schemas/users.schema';
import { UserDto } from 'domain/users/dtos/user.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { SessionService } from './session.service';
import { CreateSessionDto } from '../dtos/session.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.user.findOne({ email });
    if (user && (await compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(
    user: any,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    const payload = { email: user.email, sub: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.accessTokenExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshTokenExpiresIn'),
      }),
    ]);

    const refreshTokenExpiresIn = this.configService.get(
      'jwt.refreshTokenExpiresIn',
    );
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + this.parseExpirationTime(refreshTokenExpiresIn),
    );

    const createSessionDto: CreateSessionDto = {
      userId: user.id,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
      userAgent,
      ipAddress,
    };

    const session = await this.sessionService.createSession(createSessionDto);

    const accessTokenWithSession = await this.jwtService.signAsync(
      { ...payload, sessionId: session.id },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.accessTokenExpiresIn'),
      },
    );

    return new AuthResponseDto({
      accessToken: accessTokenWithSession,
      refreshToken,
      user: new UserDto({
        id: String(user.id),
        fullName: user.fullName,
        email: user.email,
        cpf: user.cpf,
        position: user.position,
        status: user.status,
        birthDate: user.birthDate.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }),
    });
  }

  async refreshToken(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    try {
      const session = await this.sessionService.validateSession(refreshToken);

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.user.findOne({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.sessionService.revokeSessionByRefreshToken(refreshToken);

      return this.login(user, userAgent, ipAddress);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(sessionId: string, userId: string): Promise<void> {
    await this.sessionService.revokeSession(sessionId, userId);
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await this.sessionService.revokeAllUserSessions(userId);
  }

  private parseExpirationTime(expirationTime: string): number {
    const unit = expirationTime.slice(-1);
    const value = parseInt(expirationTime.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return parseInt(expirationTime, 10);
    }
  }
}
