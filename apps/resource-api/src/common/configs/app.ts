import { registerAs, type ConfigType } from '@nestjs/config';
import * as Joi from 'joi';

interface Config {
  env: AppEnv;
  port: number;
}

export type AppEnv = 'develop';

export type AppConfig = { [TOKEN]: ConfigType<typeof app> };

const TOKEN = 'app';

export const appSchema = Joi.object({
  APP_ENV: Joi.string().valid('develop').required(),
  APP_PORT: Joi.number().port().required(),
});

export const app = registerAs<Config>(
  TOKEN,
  (): Config => ({
    env: process.env.APP_ENV,
    port: parseInt(process.env.APP_PORT, 10),
  }),
);
