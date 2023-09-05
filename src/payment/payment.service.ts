import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe : stripe
  constructor(private readonly config: ConfigService) {
    this.stripe = new stripe(this.config.get<string>('STRIPE_KEY'), {
      apiVersion: '2023-08-16'
    });
  }

  async create(createPaymentDto: Array<CreatePaymentDto>) {
    const SessionConfig: stripe.Checkout.SessionCreateParams = {
      success_url: this.config.get<string>('SUCCESS_URL'),
      line_items: createPaymentDto,
      cancel_url: this.config.get<string>('CANCEL_URL'),
      mode: "payment"
    }
    const session = await this.stripe.checkout.sessions.create(SessionConfig)
    return {message: "Payment session created successfully!\nFollow the url in response to proceed to payment page", url: session.url};
  }

  findAll() {
    return `Welcome to Payment API`;
  }

  success() {
    return 'Congratulations, Payment was completed successfully!'
  }

  fail() {
    return "Payment was canceled!"
  }
}
