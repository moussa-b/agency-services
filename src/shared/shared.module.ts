import { Global, Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { SqliteService } from './db/sqlite.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DbHealthIndicator } from './db/db-health.indicator';
import { APP_GUARD } from '@nestjs/core';
import { MailHealthIndicator } from './mail/mail-health.indicator';
import { MysqlService } from './db/mysql.service';
import { DatabaseService } from './db/database-service';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    MailService,
    DbHealthIndicator,
    MailHealthIndicator,
    {
      provide: DatabaseService,
      useClass: process.env.DATABASE_URL?.includes('mysql')
        ? MysqlService
        : SqliteService,
    },
  ],
  exports: [
    DatabaseService,
    MailService,
    DbHealthIndicator,
    MailHealthIndicator,
  ],
})
export class SharedModule {}
