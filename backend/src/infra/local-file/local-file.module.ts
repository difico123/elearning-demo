import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [],
  providers: [],
})
export class LocalFileModule {}
