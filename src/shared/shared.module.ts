import { Global, Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { SqliteService } from './db/sqlite.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('EMAIL_SMTP_HOST'),
          port: Number(config.get<string>('EMAIL_SMTP_PORT')),
          secure: config.get<string>('EMAIL_SMTP_SECURE') === 'true',
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: __dirname + '/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
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
      useClass: process.env.DATABASE_URL?.includes('mysql') ? MysqlService : SqliteService,
    }
  ],
  exports: [DatabaseService, MailService, DbHealthIndicator, MailHealthIndicator],
})
export class SharedModule {}
