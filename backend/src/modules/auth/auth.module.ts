import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { GoogleStrategy } from './stategy/google.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './stategy/local.strategy';
import { JwtStrategy } from './stategy/jwt.strategy';
// import { MailModule } from 'src/modules/mail/mail.module'; // Temporarily disabled
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constant';
import { NotificationModule } from '../notification/notification.module';
import { RedisCacheModule } from '../cache/redis-cache.module';

@Module({
  imports: [
    // MailModule, // Temporarily disabled
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NotificationModule,
    RedisCacheModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
