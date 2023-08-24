import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of the coffee' })
  readonly name: string;

  @ApiProperty({ description: 'The description of the coffee' })
  readonly description: string;

  @ApiProperty({ description: 'The category of the coffee' })
  readonly category: string;

  @ApiProperty({ description: 'The price of the coffee' })
  readonly price: number;
}
