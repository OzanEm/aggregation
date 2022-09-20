import { DataStream } from '../entities/dataStream.entity';

export type DataStreamDto = DataStream;

export type TickersDTO = {
  [ticker: string]: string;
};
