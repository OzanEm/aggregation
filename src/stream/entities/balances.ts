import Decimal from 'decimal.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Balances {
  @PrimaryColumn({ type: 'varchar', unique: false })
  userId: string;

  @Column({ type: 'varchar', primary: true, unique: false })
  ticker: string;

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
