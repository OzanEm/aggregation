import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/typeorm.config';
import { Aggregates } from './stream/entities/aggregates';
import { Balances } from './stream/entities/balances';
import { DataStream } from './stream/entities/dataStream.entity';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      typeOrmConfig([DataStream, Aggregates, Balances]),
    ),
    StreamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
