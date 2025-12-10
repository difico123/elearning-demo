import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
} from 'class-validator';

export class SignUp {
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}

export class VerifyEmail {
  @IsDefined()
  @IsNotEmpty()
  readonly url: string;

  @IsDefined()
  @IsEmail()
  readonly email: string;
}

export class PasswordBody {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
