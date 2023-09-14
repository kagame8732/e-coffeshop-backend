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
      if (uOrder.status === 'completed') {
        return { status: 201, message: 'This order is already paid!' };
      }
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
        success_url: `${this.config.get<string>(
          'SUCCESS_URL',
        )}/${createPaymentDto}`,
        line_items: [paymentObject],
        cancel_url: `${this.config.get<string>(
          'CANCEL_URL',
        )}/${createPaymentDto}`,
        client_reference_id: uOrder.user.toString(),
        mode: 'payment',
      };
      const session = await this.stripe.checkout.sessions.create(SessionConfig);

      uOrder.payment_url = session.url;
      await uOrder.save();
      return {
        message:
          'Payment session created successfully! Follow the url in response to proceed to payment page',
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

  async success(id: string) {
    try {
      const uOrder = await this.orderModel.findById(id);
      uOrder.status = 'completed';
      const updateOrder = await uOrder.save();
      return {
        status: 200,
        message: 'Order Completed Successfully',
        order: updateOrder,
      };
    } catch (error) {
      console.log(error);
      return 'Payment was successful, but your order was not updated!';
    }
  }

  async fail(id: string) {
    try {
      const uOrder = await this.orderModel.findById(id);
      uOrder.status = 'failed';
      const updateOrder = await uOrder.save();
      return { status: 200, message: 'Order Failed', order: updateOrder };
    } catch (error) {
      console.log(error);
      return 'Payment was not successful, and order was not updated!';
    }
  }
}
