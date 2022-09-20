import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataStream } from './entities/dataStream.entity';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

import * as redisStore from 'cache-manager-redis-store';
import { Aggregates } from './entities/aggregates';
import { Balances } from './entities/balances';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataStream, Aggregates, Balances]),
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
      ttl: 0,
      max: Math.pow(2, 31),
    }),
  ],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
