import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/entity/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendResetPasswordLink(email: string, url: string) {
    try {
      return this.mailerService.sendMail({
        to: email,
        subject: 'Reset password',
        template: './reset_password',
        context: {
          name: email,
          url,
          app_name: process.env.APP_NAME,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  sendUserEmailConfirmation(
    user: Pick<User, 'email' | 'username'>,
    url: string,
  ) {
    try {
      return this.mailerService
        .sendMail({
          to: user.email,
          subject: `Welcome to ${process.env.APP_NAME} App! Confirm your Email`,
          template: './confirmation',
          context: {
            name: user.email,
            url,
            app_name: process.env.APP_NAME,
          },
        })
        .catch((error) => {
          console.error({ error });
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
