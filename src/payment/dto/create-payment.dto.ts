import { ApiProperty } from '@nestjs/swagger';

export class ProductData {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class PriceData {
  @ApiProperty()
  currency: 'usd' | 'cad' | 'gbp';

  @ApiProperty()
  unit_amount: number;

  @ApiProperty()
  product_data: ProductData;
}

export class CreatePaymentDto {
  @ApiProperty()
  order: string;
}
