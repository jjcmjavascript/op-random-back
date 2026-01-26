// all-exceptions.filter.ts
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '@shared/services/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<FastifyRequest & { id: string }>();
    const res = ctx.getResponse<FastifyReply>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = isHttp ? exception.message : 'Internal server error';

    if (exception instanceof BadRequestException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res['message']) {
        if (Array.isArray(res['message'])) {
          message = `${message}: ${res['message'].join(', ')}`;
        }
      }
    }
    const id = req.id;

    this.logger.error(
      `[${id}] (${status}) ${req.method} ${req.url} - ${message}`,
      {
        message: (exception as Error)?.message,
        stack: (exception as Error)?.stack,
      },
    );

    const payload = isHttp
      ? exception.getResponse()
      : { statusCode: status, message };

    // Fastify
    res.status(status).send(payload);
  }
}
