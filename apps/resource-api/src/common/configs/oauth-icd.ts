import { registerAs, type ConfigType } from '@nestjs/config';
import * as Joi from 'joi';

interface Config {
  api: {
    uri: string;
    uriFallback: string;
  };
  oauth: {
    tokenUri: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    grantType: string;
  };
}

export type IcdConfig = ConfigType<typeof oauthIcd>;

export type IcdConfigWithPath = { [TOKEN]: ConfigType<typeof oauthIcd> };

const TOKEN = 'icd';

export const oauthIcdSchema = Joi.object({
  ICD_API_URI: Joi.string().uri().required(),
  ICD_API_URI_FALLBACK: Joi.string().uri().required(),
  ICD_OAUTH_TOKEN_URI: Joi.string().uri().required(),
  ICD_OAUTH_CLIENT_ID: Joi.string().required(),
  ICD_OAUTH_CLIENT_SECRET: Joi.string().required(),
  ICD_OAUTH_SCOPE: Joi.string().required(),
  ICD_OAUTH_GRANT_TYPE: Joi.string().valid('client_credentials').required(),
});

export const oauthIcd = registerAs<Config>(
  TOKEN,
  (): Config => ({
    api: {
      uri: process.env.ICD_API_URI,
      uriFallback: process.env.ICD_API_URI_FALLBACK,
    },
    oauth: {
      tokenUri: process.env.ICD_OAUTH_TOKEN_URI,
      clientId: process.env.ICD_OAUTH_CLIENT_ID,
      clientSecret: process.env.ICD_OAUTH_CLIENT_SECRET,
      scope: process.env.ICD_OAUTH_SCOPE,
      grantType: process.env.ICD_OAUTH_GRANT_TYPE,
    },
  }),
);
