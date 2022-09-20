import Decimal from 'decimal.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Aggregates {
  @PrimaryColumn({ type: 'varchar', unique: true })
  tickers: string;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: Decimal) => {
        return value.toString();
      },
      from: (value: string) => {
        return new Decimal(value);
      },
    },
  })
  balance: Decimal;
}
