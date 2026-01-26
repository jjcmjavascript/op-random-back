import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getTimeDuration } from '../helpers/get-time-duration.helper';
import { Logger } from '../services/logger.service';

const getRequestData = (data: unknown): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (data && data['body'] && Object.keys(data['body']).length > 0) {
    result.body = data['body'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (data && data['query'] && Object.keys(data['query']).length > 0) {
    result.query = data['query'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (data && data['params'] && Object.keys(data['params']).length > 0) {
    result.params = data['params'];
  }

  return result;
};

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const id = Math.random().toString(30).substring(2, 15);
    const initDate = new Date();
    request['id'] = id;

    this.logger.init(
      `[${id}] Request - Url: ${request.url}, ${request.method}, date: ${initDate.toISOString()}`,
      getRequestData(request),
    );

    return next.handle().pipe(
      tap((data: Record<string, unknown>) => {
        const { toSeconds, endDate } = getTimeDuration(initDate);

        this.logger.end(
          `[${id}] Response - Url: ${request.url}, Date: ${endDate.toISOString()}, Duration: ${toSeconds}s`,
          data,
        );
      }),
    );
  }
}
