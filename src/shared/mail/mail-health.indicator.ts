import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { MailService } from './mail.service';

@Injectable()
export class MailHealthIndicator extends HealthIndicator {
  constructor(private mailService: MailService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    return this.getStatus('mail', await this.mailService.verifyTransporter());
  }
}
