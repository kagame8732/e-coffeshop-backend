/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CoffeeServices } from './coffee.service';
import { CreateCoffeeDto } from './create-coffee.dto';
import { ApiTags,ApiOperation } from '@nestjs/swagger';
import { UpdateCoffeeDto } from './update-coffee.dto';

@ApiTags('Coffee')
@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeServices) {}
  @ApiOperation({ summary: 'Create a new coffee' })
  @Post()
  CreateCoffee(@Body() createCoffeDto: CreateCoffeeDto): any {
    return this.coffeeService.addCoffee(createCoffeDto);
  }
  @ApiOperation({ summary: 'Get all coffee' })
  @Get()
  async getAvailableCoffee() {
    const coffeee = await this.coffeeService.getCoffee();
    return coffeee;
  }
  @ApiOperation({ summary: 'Get a single coffee' })
  @Get(':id')
  async getCoffeeById(@Param('id') coffeeId: string) {
    const coffee = await this.coffeeService.getSingleCoffee(coffeeId);
    return coffee;
  }
  @ApiOperation({ summary: 'Update a single coffee' })
  @Patch(':id')
  async updateCoffee(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    const coffee = await this.coffeeService.updateCoffee(updateCoffeeDto);
    return coffee;
  }
  @ApiOperation({ summary: 'Delete a single coffee' })
  @Delete(':id')
  async deleteCoffee(
    @Param('id') coffeeId: string,
    @Body('reason') reason: string,
  ) {
    const response = await this.coffeeService.deleteCoffee(coffeeId);
    return `Coffee deleted due to ${reason}`;
  }
}
