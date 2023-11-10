import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/schema.order';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto, UpdateOrderDto } from './schemas/order.dto';
import { IsLogged } from 'src/guards/isLogged.guard';

@ApiBearerAuth('jwt')
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}
  @ApiOperation({ summary: 'Create a new order' })
  @UseGuards(IsLogged)
  @Post()
  create(@Body() orderData: CreateOrderDto, @Req() request): Promise<Order> {
    const token = request.headers['authorization'];
    return this.orderService.createOrder(orderData, token);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @UseGuards(IsLogged)
  @Get()
  findAll(@Req() request): Promise<Order[]> {
    const token = request.headers['authorization'];
    return this.orderService.findAllOrders(token);
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
