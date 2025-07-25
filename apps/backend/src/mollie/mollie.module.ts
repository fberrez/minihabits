import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MollieService } from './mollie.service';

@Module({})
export class MollieModule {
  static forRootAsync(): DynamicModule {
    return {
      module: MollieModule,
      imports: [ConfigModule],
      providers: [MollieService],
      exports: [MollieService],
      global: true,
    };
  }
}