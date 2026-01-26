import { Global, Module } from '@nestjs/common';
import { FetchService } from './fetch.service';

@Global()
@Module({
  providers: [FetchService],
  exports: [FetchService],
})
export class FetchModule {}
