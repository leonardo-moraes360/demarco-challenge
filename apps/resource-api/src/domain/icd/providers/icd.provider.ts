import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  type OnModuleInit,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { type AxiosResponse } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { oauthIcd, type IcdConfig } from 'common/configs/oauth-icd';
import { handleRequestError } from 'common/functions/handle-request-error';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const ACCESS_TOKEN_KEY = 'icd:access-token';
const TOKEN_EXPIRY_KEY = 'icd:token-expiry';

@Injectable()
export class IcdProvider implements OnModuleInit {
  private readonly logger = new Logger(IcdProvider.name);
  private isReady: boolean = false;

  constructor(
    private readonly httpService: HttpService,
    @Inject(oauthIcd.KEY) private readonly config: IcdConfig,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureValidToken();
  }

  private async ensureValidToken(): Promise<void> {
    try {
      const [accessToken, tokenExpiry] = await this.cacheManager.mget<string>([
        ACCESS_TOKEN_KEY,
        TOKEN_EXPIRY_KEY,
      ]);

      const now = Date.now();
      const expiryTime = tokenExpiry ? parseInt(tokenExpiry, 10) : 0;

      if (!accessToken || now >= expiryTime - 300000) {
        await this.authenticate();
      } else {
        this.isReady = true;
      }
    } catch (error) {
      this.logger.error('Failed to ensure valid token', error);
      await this.authenticate();
    }
  }

  private async authenticate(): Promise<void> {
    try {
      this.logger.log('Authenticating with ICD API...');

      const params = new URLSearchParams();

      params.append('grant_type', this.config.oauth.grantType);
      params.append('client_id', this.config.oauth.clientId);
      params.append('client_secret', this.config.oauth.clientSecret);
      params.append('scope', this.config.oauth.scope);

      const response = await firstValueFrom<AxiosResponse<TokenResponse>>(
        this.httpService
          .post(this.config.oauth.tokenUri, params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .pipe(
            catchError((error) => {
              this.logger.error(
                'Authentication failed:',
                error.response?.data || error.message,
              );
              return handleRequestError(error);
            }),
          ),
      );

      const { access_token, expires_in } = response.data;
      const expiryTime = Date.now() + expires_in * 1000;

      await this.cacheManager.mset([
        { key: ACCESS_TOKEN_KEY, value: access_token },
        { key: TOKEN_EXPIRY_KEY, value: expiryTime.toString() },
      ]);

      this.isReady = true;
      this.logger.log('Successfully authenticated with ICD API');
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      this.isReady = false;
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    if (!this.isReady) {
      await this.ensureValidToken();
    }

    const accessToken = await this.cacheManager.get<string>(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      throw new HttpException('No access token available', 500);
    }

    return accessToken;
  }

  async findOne(id: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await firstValueFrom<AxiosResponse>(
      this.httpService
        .get(`${this.config.api.uri}/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Accept-Language': 'pt',
            'API-Version': 'v2',
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(
              `Failed to fetch ICD entity ${id}:`,
              error.response?.data || error.message,
            );
            return handleRequestError(error);
          }),
        ),
    );

    return response.data;
  }

  async findAll(params: any): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await firstValueFrom<AxiosResponse>(
      this.httpService
        .get(`${this.config.api.uri}/search`, {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Accept-Language': 'pt',
            'API-Version': 'v2',
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(
              'Failed to search ICD entities:',
              error.response?.data || error.message,
            );
            return handleRequestError(error);
          }),
        ),
    );

    return response.data;
  }
}
