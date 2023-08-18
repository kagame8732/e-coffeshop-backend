import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/schema.order';
import { Model } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from './schemas/order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(orderData);
    return createdOrder.save();
  }
  async findAllOrders(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('coffee', 'name description price')
      .exec();
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
