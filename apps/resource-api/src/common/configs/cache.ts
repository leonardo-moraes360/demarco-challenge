import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const cache = registerAs('cache', () => ({
  host: process.env.CACHE_HOST || 'localhost',
  port: parseInt(process.env.CACHE_PORT || '6379', 10),
  password: process.env.CACHE_PASSWORD || undefined,
  db: parseInt(process.env.CACHE_DB || '0', 10),
  ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
}));

export const cacheSchema = Joi.object({
  CACHE_HOST: Joi.string().default('localhost'),
  CACHE_PORT: Joi.number().port().default(6379),
  CACHE_PASSWORD: Joi.string().optional(),
  CACHE_DB: Joi.number().min(0).max(15).default(0),
  CACHE_TTL: Joi.number().min(1).default(3600),
});
