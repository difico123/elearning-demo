import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'database/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        const mysqlDatabase = DatabaseConfig.find(
          (item) => item.type === 'mysql',
        );
        const { database, port, username, password, host } = mysqlDatabase;
        const options: TypeOrmModuleOptions = {
          name: 'default',
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: true,
        };
        return options;
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
