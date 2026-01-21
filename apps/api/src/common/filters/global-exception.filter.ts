import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_CODES } from '@restaurant/shared';

interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isProduction = process.env.NODE_ENV === 'production';

    let status: number;
    let message: string;
    let error: string;
    let details: unknown;
    let code: string = ERROR_CODES.INVALID_INPUT.code;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = HttpStatus[status] || 'Error';
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || exception.message;
        error = (resp.error as string) || HttpStatus[status] || 'Error';
        details = resp.message;
      } else {
        message = exception.message;
        error = HttpStatus[status] || 'Error';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = isProduction ? 'Internal server error' : (exception as Error)?.message || 'Unknown error';
    error = 'Internal Server Error';
    code = ERROR_CODES.INTERNAL_SERVER_ERROR?.code || 'GEN_001';

      // Log unexpected errors
      this.logger.error(
        `Unexpected error: ${(exception as Error)?.message}`,
        (exception as Error)?.stack,
      );
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      code = ERROR_CODES.AUTH_UNAUTHORIZED.code;
    } else if (status === HttpStatus.FORBIDDEN) {
      code = ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS.code;
    } else if (status === HttpStatus.NOT_FOUND) {
      code = ERROR_CODES.MENU_ITEM_NOT_FOUND.code;
    } else if (status === HttpStatus.TOO_MANY_REQUESTS) {
      code = 'SYS_429';
    } else if (status === HttpStatus.BAD_REQUEST) {
      code = ERROR_CODES.VALIDATION_ERROR.code;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      code,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      details: !isProduction ? details : undefined,
    };

    // Don't expose stack traces in production
    if (!isProduction && exception instanceof Error) {
      (errorResponse as unknown as Record<string, unknown>).stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
