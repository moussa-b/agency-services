import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: this.config.get<string>('EMAIL_SMTP_HOST'),
        port: Number(this.config.get<string>('EMAIL_SMTP_PORT')),
        secure: this.config.get<string>('EMAIL_SMTP_SECURE') === 'true',
        auth: {
          user: this.config.get<string>('EMAIL_USER'),
          pass: this.config.get<string>('EMAIL_PASSWORD'),
        },
      },
      {
        from: '"No Reply" <noreply@example.com>',
      },
    );

    // Configure Handlebars plugin
    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: path.join(__dirname, './templates/'),
          defaultLayout: false,
          partialsDir: path.join(__dirname, './templates/'),
        },
        viewPath: path.join(__dirname, './templates/'),
        extName: '.hbs',
      }),
    );
  }

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
    return await this.transporter.sendMail({
      to: to,
      subject: subject,
      ...configuration,
    });
  }

  async verifyTransporter(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.log('Mailer check failed with error : ', error);
      return false;
    }
  }
}
