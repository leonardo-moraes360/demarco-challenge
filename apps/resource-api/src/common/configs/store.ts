import { registerAs, type ConfigType } from '@nestjs/config';
import * as Joi from 'joi';

interface Config {
  uri: string;
  bucketName: string;
  presignedUriTTL: number;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export type StoreConfig = ConfigType<typeof store>;

export type StoreConfigWithPath = { [TOKEN]: ConfigType<typeof store> };

const TOKEN = 'store';

export const storeSchema = Joi.object({
  STORE_URI: Joi.string().uri().required(),
  STORE_BUCKET_NAME: Joi.string().required(),
  STORE_PRESIGNED_URI_TTL: Joi.number().positive().integer().required(),
  STORE_ACCESS_KEY_ID: Joi.string().required(),
  STORE_SECRET_ACCESS_KEY: Joi.string().required(),
  STORE_REGION: Joi.string().required(),
});

export const store = registerAs<Config>(
  TOKEN,
  (): Config => ({
    uri: process.env.STORE_URI,
    bucketName: process.env.STORE_BUCKET_NAME,
    presignedUriTTL: parseInt(process.env.STORE_PRESIGNED_URI_TTL, 10),
    accessKeyId: process.env.STORE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORE_SECRET_ACCESS_KEY,
    region: process.env.STORE_REGION,
  }),
);
