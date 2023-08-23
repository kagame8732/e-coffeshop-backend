import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: string, code: string, email: string) {
    const theCode = `${code}`;
    // SENDING EMAIL TO THE USER WITH THE CONFIRMATION CODE
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"Support Team"',
        subject: 'Two-Factor Authentication Code',
        template: './twoFactorTemplate',
        context: {
          name: user,
          code: theCode,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
