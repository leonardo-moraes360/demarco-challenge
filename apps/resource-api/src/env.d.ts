import { AppEnv } from 'common/configs/app';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The environment in which the application is running.
       */
      APP_ENV: AppEnv;
      /**
       * The port on which the application should listen.
       */
      APP_PORT: string;

      /**
       * The URI of the storage service.
       */
      STORE_URI: string;
      /**
       * The name of the bucket for the storage service.
       */
      STORE_BUCKET_NAME: string;

      /**
       * The TTL for the presigned URI.
       */
      STORE_PRESIGNED_URI_TTL: string;
      /**
       * The access key ID for the storage service.
       */
      STORE_ACCESS_KEY_ID: string;
      /**
       * The secret access key for the storage service.
       */
      STORE_SECRET_ACCESS_KEY: string;
      /**
       * The region for the storage service.
       */
      STORE_REGION: string;

      /**
       * The URI of the Identity Cloud API.
       */
      ICD_API_URI: string;
      /**
       * The fallback URI of the Identity Cloud API.
       */
      ICD_API_URI_FALLBACK: string;

      /**
       * The URI of the Identity Cloud OAuth token endpoint.
       */
      ICD_OAUTH_TOKEN_URI: string;
      /**
       * The client ID for the Identity Cloud OAuth client.
       */
      ICD_OAUTH_CLIENT_ID: string;
      /**
       * The client secret for the Identity Cloud OAuth client.
       */
      ICD_OAUTH_CLIENT_SECRET: string;
      /**
       * The scope for the Identity Cloud OAuth client.
       */
      ICD_OAUTH_SCOPE: string;
      /**
       * The grant type for the Identity Cloud OAuth client.
       */
      ICD_OAUTH_GRANT_TYPE: string;

      /**
       * The secret key for JWT token signing.
       */
      JWT_SECRET: string;
      /**
       * The secret key for JWT refresh token signing.
       */
      JWT_REFRESH_SECRET: string;
      /**
       * The expiration time for JWT access tokens.
       */
      JWT_ACCESS_TOKEN_EXPIRES_IN: string;
      /**
       * The expiration time for JWT refresh tokens.
       */
      JWT_REFRESH_TOKEN_EXPIRES_IN: string;

      /**
       * The host for the cache service (Redis).
       */
      CACHE_HOST: string;
      /**
       * The port for the cache service (Redis).
       */
      CACHE_PORT: string;
      /**
       * The password for the cache service (Redis).
       */
      CACHE_PASSWORD?: string;
      /**
       * The database number for the cache service (Redis).
       */
      CACHE_DB: string;
      /**
       * The TTL for cache entries.
       */
      CACHE_TTL: string;
    }
  }
}
