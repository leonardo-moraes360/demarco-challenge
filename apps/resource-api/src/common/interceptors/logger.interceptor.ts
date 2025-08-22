import {
  Injectable,
  Logger,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { tap, type Observable } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const { method, url, ip } = request;

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`${ip} ${method} ${url} took ${Date.now() - now}ms`),
        ),
      );
  }
}
