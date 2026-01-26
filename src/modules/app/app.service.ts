import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  wildcard(): string {
    return 'Endpoint not found';
  }
}
