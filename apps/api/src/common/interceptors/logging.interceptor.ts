import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { ip?: string }>();
    const { method, url } = request;
    const ip = request.ip || 'unknown';
    const userAgent = request.headers?.['user-agent'] || 'unknown';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const logPayload = {
          type: 'http_request',
          method,
          url,
          ip,
          userAgent,
          durationMs: duration,
          timestamp: new Date().toISOString(),
        };
        this.logger.log(JSON.stringify(logPayload));
      }),
    );
  }
}
