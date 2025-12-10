import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({ message: 'not valid email' })
  email: string;

  @IsDefined({ message: 'not empty url' })
  @IsNotEmpty({ message: 'not empty url' })
  readonly url: string;
}

export interface VerifyCodeDto {
  email: string;
  code: string;
}

export interface VerifyCodeUser {
  email: string;
  id: string;
  resetToken: string;
  expiredTokenTime: Date | null;
}
