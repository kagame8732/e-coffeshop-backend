import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsLogged } from 'src/guards/isLogged.guard';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/pay')
  @UseGuards(IsLogged)
  @ApiOperation({ description: 'Endpoint for initiating payment sessions' })
  @ApiBody({
    type: CreatePaymentDto,
  })
  @ApiBearerAuth('jwt')
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto.order);
  }

  @Get()
  @ApiOperation({ description: 'Welcome to payment Endpoint' })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('/success/:id')
  @ApiOperation({ description: 'Endpoint for completed payment sessions' })
  success(@Param('id') id: string) {
    return this.paymentService.success(id);
  }

  @Get('/fail/:id')
  @ApiOperation({ description: 'Endpoint for failed payment sessions' })
  fail(@Param('id') id: string) {
    return this.paymentService.fail(id);
  }
}
