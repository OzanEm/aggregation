import { NestFactory } from '@nestjs/core';
import { Fn } from 'ramda';
import { AppModule } from './app.module';

declare const module: {
  hot: {
    accept: Fn;
    dispose: Fn;
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}

bootstrap();
