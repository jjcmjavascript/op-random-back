import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/*')
  @HttpCode(HttpStatus.NOT_FOUND)
  getWildCard(): string {
    return this.appService.wildcard();
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
