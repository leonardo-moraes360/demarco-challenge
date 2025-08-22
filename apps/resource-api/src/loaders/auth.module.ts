import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from 'domain/auth/controllers/auth.controller';
import { SessionController } from 'domain/auth/controllers/session.controller';
import { AuthService } from 'domain/auth/services/auth.service';
import { SessionService } from 'domain/auth/services/session.service';
import { SessionCleanupService } from 'domain/auth/services/session-cleanup.service';
import { LocalStrategy } from 'domain/auth/strategies/local.strategy';
import { JwtStrategy } from 'domain/auth/strategies/jwt.strategy';
import { User, UserSchema } from 'domain/users/schemas/users.schema';
import { Session, SessionSchema } from 'domain/auth/schemas/session.schema';
import { jwt } from 'common/configs/jwt';

@Module({
  imports: [
    ConfigModule.forFeature(jwt),
    PassportModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Session.name,
        schema: SessionSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessTokenExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, SessionController],
  providers: [
    AuthService,
    SessionService,
    SessionCleanupService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, SessionService],
})
export class AuthModule {}
