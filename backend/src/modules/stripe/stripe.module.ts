import { Module, forwardRef, DynamicModule, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STRIPE_CLIENT } from 'src/common/constant';
import { Stripe } from 'stripe';
import { AuthModule } from '../auth/auth.module';

@Module({})
export class StripeModule {
  static forRoot(apiKey: string): DynamicModule {
    const stripe = new Stripe(apiKey, { apiVersion: '2022-08-01' });
    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe,
    };

    return {
      module: StripeModule,
      providers: [stripeProvider],
      global: true,
      exports: [stripeProvider],
    };
  }
}
