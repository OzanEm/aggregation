import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StreamService } from './stream.service';
import { DataStreamDto, TickersDTO } from './models/dto';
@Controller()
export class StreamController {
  constructor(private streamService: StreamService) {}

  @Post()
  async receiveData(@Body() data: DataStreamDto) {
    await this.streamService.receiveData(data);
  }

  @Get('tickers')
  async getTickers(): Promise<TickersDTO> {
    return await this.streamService.getTickers();
  }

  @Get('tickers/:id')
  async getUserBalances(@Param('id') userId: string) {
    return await this.streamService.getUserBalances(userId);
  }
}
