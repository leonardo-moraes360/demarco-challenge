import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class RequestInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const ip = this.getClientIp(request);
    (request as any).ip = ip;

    const userAgent = request.headers['user-agent'] || 'Unknown';
    (request as any).userAgent = userAgent;

    return next.handle();
  }

  private getClientIp(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const ips = xForwardedFor.toString().split(',');
      return ips[0].trim();
    }

    const xRealIp = request.headers['x-real-ip'];
    if (xRealIp) {
      return xRealIp.toString();
    }

    const xClientIp = request.headers['x-client-ip'];
    if (xClientIp) {
      return xClientIp.toString();
    }

    return (
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }
}
