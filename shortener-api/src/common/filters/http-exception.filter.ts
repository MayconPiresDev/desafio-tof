import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno no servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = (exception.getResponse() as any).message || exception.message;
    } else if (exception instanceof QueryFailedError) {
      // Trata erros de banco como duplicidade de Unique Key
      if (exception.message.includes('unique constraint')) {
        status = HttpStatus.CONFLICT;
        message = 'O registro já existe no sistema.';
      }
    }

    this.logger.error(
      `Status: ${status} | Error: ${message} | Stack: ${exception.stack}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: message,
    });
  }
}
