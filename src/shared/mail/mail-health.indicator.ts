import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailHealthIndicator extends HealthIndicator {

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    return this.getStatus('mail', await this.mailerService.verifyAllTransporters());
  }
}
