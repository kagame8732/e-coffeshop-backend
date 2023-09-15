import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/schema.order';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateOrderDto, UpdateOrderDto } from './schemas/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private jwtService: JwtService,
  ) {}

  async createOrder(orderData: CreateOrderDto, token): Promise<Order> {
    const tokenP = token.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(tokenP, {
      secret: process.env.JWT_SECRET,
    });
    const userId = payload.id;
    const orderWithUser = {
      ...orderData,
      user: userId,
      payment_url: '',
      status: 'pending',
    };

    return this.orderModel.create(orderWithUser);
  }
  async findAllOrders(token): Promise<Order[]> {
    const [type, tokenP] = token.split(' ');
    const payload = await this.jwtService.verifyAsync(tokenP, {
      secret: process.env.JWT_SECRET,
    });
    const user = payload.id;
    if (payload.role === 1) {
      // If the user is an admin, return all orders
      return this.orderModel
        .find()
        .populate('coffee', 'name description price')
        .exec();
    } else if (payload.role === 2) {
      // If the user is not an admin, return only their own orders
      const orders = await this.orderModel.find({ user });
      if (orders.length === 0) {
        return [];
      } else {
        return orders;
      }
    } else {
      throw new Error('Invalid user role');
    }
  }

  async findOrderById(orderId: string): Promise<Order> {
    return this.orderModel
      .findById(orderId)
      .populate('coffee', 'name description price')
      .exec();
  }

  async updateOrder(
    orderId: string,
    updateData: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(orderId, updateData, { new: true })
      .exec();
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.orderModel.findByIdAndDelete(orderId).exec();
  }
}
