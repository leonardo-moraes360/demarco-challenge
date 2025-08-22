import { registerAs, type ConfigType } from '@nestjs/config';
import * as Joi from 'joi';

interface Config {
  secret: string;
  refreshSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export type JwtConfig = ConfigType<typeof jwt>;

export type JwtConfigWithPath = { [TOKEN]: ConfigType<typeof jwt> };

const TOKEN = 'jwt';

export const jwtSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
});

export const jwt = registerAs<Config>(
  TOKEN,
  (): Config => ({
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  }),
);
