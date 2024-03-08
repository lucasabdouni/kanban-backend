import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import dbConfiguration from './config/db.config';
import { CardsModule } from './kanban/cards/cards.module';
import { CardsResolver } from './kanban/cards/cards.resolver';
import { CardsService } from './kanban/cards/cards.service';
import { ColumnsModule } from './kanban/columns/columns.module';
import { ColumnsResolver } from './kanban/columns/columns.resolver';
import { ColumnsService } from './kanban/columns/columns.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    AuthModule,
    CardsModule,
    ColumnsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CardsService,
    CardsResolver,
    ColumnsService,
    ColumnsResolver,
  ],
})
export class AppModule {}
