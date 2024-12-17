import { Global, Module } from "@nestjs/common";
import { MailService } from './mail/mail.service';
import { SqliteService } from "./db/sqlite.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { DbHealthIndicator } from "./db/db-health.indicator";
import { APP_GUARD } from "@nestjs/core";
import { MailHealthIndicator } from "./mail/mail-health.indicator";

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
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
    SqliteService,
    MailService,
    DbHealthIndicator,
    MailHealthIndicator
  ],
  exports: [SqliteService, MailService, DbHealthIndicator, MailHealthIndicator]
})
export class SharedModule {}
