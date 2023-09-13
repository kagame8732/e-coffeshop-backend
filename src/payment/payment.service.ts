import { Injectable } from '@nestjs/common';
import stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coffee } from 'src/coffee/coffee.model';
import { Order } from 'src/orders/schemas/schema.order';

@Injectable()
export class PaymentService {
  private stripe: stripe;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel('Coffee') private readonly coffeeModel: Model<Coffee>,
    private readonly config: ConfigService,
  ) {
    this.stripe = new stripe(this.config.get<string>('STRIPE_KEY'), {
      apiVersion: '2023-08-16',
    });
  }

  async create(createPaymentDto: string) {
    try {
      const uOrder = await this.orderModel.findById(createPaymentDto);
      const uCoffee = await this.coffeeModel.findById(uOrder.coffee);
      const paymentObject = {
        price_data: {
          currency: 'usd',
          unit_amount: uCoffee.price,
          product_data: {
            name: uCoffee.name,
            description: uCoffee.description,
          },
        },
        quantity: uOrder.quantity,
      };

      const SessionConfig: stripe.Checkout.SessionCreateParams = {
        success_url: this.config.get<string>('SUCCESS_URL'),
        line_items: [paymentObject],
        cancel_url: this.config.get<string>('CANCEL_URL'),
        mode: 'payment',
      };
      const session = await this.stripe.checkout.sessions.create(SessionConfig);
      return {
        message:
          'Payment session created successfully!\nFollow the url in response to proceed to payment page',
        url: session.url,
      };
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed')) {
        return { status: 400, message: 'Resource not found!' };
      }
      return { status: 400, message: 'Error Occurred when paying!' };
    }
  }

  findAll() {
    return `Welcome to Payment API`;
  }

  success() {
    return 'Congratulations, Payment was completed successfully!';
  }

  fail() {
    return 'Payment was canceled!';
  }
}
