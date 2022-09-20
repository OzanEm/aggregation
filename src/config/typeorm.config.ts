import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (entities = []) => {
  return {
    imports: [ConfigModule],
    useFactory: (
      configService: ConfigService,
    ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> => {
      return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB'),
        entities: entities,
        synchronize: true,
      };
    },
    inject: [ConfigService],
  };
};
