import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'id of a coffe' })
  readonly coffee: string;
  @ApiProperty({ description: 'Quantity of order' })
  readonly quantity: number;
  readonly user: string;


}

export class UpdateOrderDto {
  @ApiProperty({ description: 'id of a coffe' })
  readonly coffee: string;

  @ApiProperty({ description: 'Quantity of order' })
  readonly quantity: number;
}
