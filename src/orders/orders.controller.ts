import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/schema.order';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto, UpdateOrderDto } from './schemas/order.dto';
import { IsLogged } from 'src/guards/isLogged.guard';
import { IsAdmin } from 'src/guards/isAdmin.guard';

@ApiBearerAuth('jwt')
@ApiTags()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}
  @ApiOperation({ summary: 'Create a new order' })
  @UseGuards(IsLogged)
  @Post()
  create(@Body() orderData: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(orderData);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @UseGuards(IsAdmin)
  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAllOrders();
  }

  @ApiOperation({ summary: 'Get single order' })
  @UseGuards(IsLogged)
  @Get(':id')
  findOne(@Param('id') orderId: string): Promise<Order> {
    return this.orderService.findOrderById(orderId);
  }

  @ApiOperation({ summary: 'Change orders' })
  @UseGuards(IsLogged)
  @Put(':id')
  update(
    @Param('id') orderId: string,
    @Body() updateData: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateOrder(orderId, updateData);
  }

  @ApiOperation({ summary: 'Delete order' })
  @UseGuards(IsLogged)
  @Delete(':id')
  remove(@Param('id') orderId: string): Promise<void> {
    return this.orderService.deleteOrder(orderId);
  }
}