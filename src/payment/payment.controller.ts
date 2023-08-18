import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Payment")
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("/pay")
  @ApiOperation({description: "Endpoint for initiating payment sessions"})
  @ApiBody({
    type: [CreatePaymentDto]
  })
  create(@Body() createPaymentDto: Array<CreatePaymentDto>) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({description: "Welcome to payment Endpoint"})
  findAll() {
    return this.paymentService.findAll();
  }

  @Get("/success")
  @ApiOperation({description: "Endpoint for completed payment sessions"})
  success() {
    return this.paymentService.success();
  }

  @Get("/fail")
  @ApiOperation({description: "Endpoint for failed payment sessions"})
  fail() {
    return this.paymentService.fail();
  }
}
