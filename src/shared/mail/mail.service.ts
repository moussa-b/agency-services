import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    configuration: {
      template?: string;
      text?: string;
      html?: string;
      context?: any;
    },
  ) {
    return await this.mailerService.sendMail({
      to: to,
      subject: subject,
      ...configuration,
    });
  }
}
