import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DataStream } from './entities/dataStream.entity';
import { DataStreamDto, TickersDTO } from './models/dto';
import { Aggregates } from './entities/aggregates';
import Decimal from 'decimal.js';
import { Balances } from './entities/balances';

@Injectable()
export class StreamService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async receiveData(data: DataStreamDto) {
    const tickers = (await this.cacheManager.get('tickers')) ?? {};
    const userBalances = (await this.cacheManager.get(data.userId)) ?? {};

    let agg: Aggregates;
    let balance: Balances;

    await this.entityManager.transaction(
      async (transactionManager: EntityManager) => {
        await transactionManager.save(DataStream, data);
        const record = await transactionManager.findOne(Aggregates, {
          where: {
            tickers: data.ticker,
          },
        });

        if (record) {
          agg = await transactionManager.save(Aggregates, {
            tickers: data.ticker,
            balance: Decimal.add(record.balance, data.Balance),
          });
        } else {
          agg = await transactionManager.save(Aggregates, {
            tickers: data.ticker,
            balance: new Decimal(data.Balance),
          });
        }

        const balanceRecord = await transactionManager.findOne(Balances, {
          where: {
            userId: data.userId,
            ticker: data.ticker,
          },
        });

        if (balanceRecord) {
          balance = await transactionManager.save(Balances, {
            userId: data.userId,
            ticker: data.ticker,
            balance: Decimal.add(balanceRecord.balance, data.Balance),
          });
        } else {
          balance = await transactionManager.save(Balances, {
            userId: data.userId,
            ticker: data.ticker,
            balance: new Decimal(data.Balance),
          });
        }
      },
    );

    tickers[agg.tickers] = agg.balance.toString();
    userBalances[data.ticker] = balance.balance.toString();

    await this.cacheManager.set('tickers', tickers);
    await this.cacheManager.set(data.userId, userBalances);
  }

  async getTickers(): Promise<TickersDTO> {
    const tickers: TickersDTO = await this.cacheManager.get('tickers');
    if (tickers) return tickers;

    const tickersData: TickersDTO = {};
    (await this.entityManager.find(Aggregates)).forEach(
      ({ tickers, balance }) => (tickersData[tickers] = balance.toString()),
    );

    await this.cacheManager.set('tickers', tickersData);

    return tickersData;
  }

  async getUserBalances(userId: string): Promise<TickersDTO> {
    const userBalance: TickersDTO = await this.cacheManager.get(userId);
    if (userBalance) return userBalance;

    const userBalanceData: TickersDTO = {};
    (await this.entityManager.find(Balances, { where: { userId } })).forEach(
      ({ ticker, balance }) => (userBalanceData[ticker] = balance.toString()),
    );

    await this.cacheManager.set(userId, userBalanceData);

    return userBalanceData;
  }
}
