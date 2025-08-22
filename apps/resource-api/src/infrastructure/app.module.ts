import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerInterceptor } from 'common/interceptors/logger.interceptor';
import { app, appSchema } from 'common/configs/app';
import { jwtSchema } from 'common/configs/jwt';
import { oauthIcdSchema } from 'common/configs/oauth-icd';
import { storeSchema } from 'common/configs/store';
import { cache, cacheSchema } from 'common/configs/cache';
import { LoaderModule } from '../loaders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [app, cache],
      validationSchema: appSchema
        .concat(jwtSchema)
        .concat(oauthIcdSchema)
        .concat(storeSchema)
        .concat(cacheSchema),
    }),
    HttpModule.register({
      global: true,
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('cache.host'),
        port: configService.get('cache.port'),
        password: configService.get('cache.password'),
        db: configService.get('cache.db'),
        ttl: configService.get('cache.ttl'),
        max: 100,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/resource-api'),
    LoaderModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
