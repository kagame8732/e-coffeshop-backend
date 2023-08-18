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
import { ApiTags } from '@nestjs/swagger';
import { UpdateCoffeeDto } from './update-coffee.dto';

@ApiTags('Coffee')
@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeServices) {}
  @Post()
  CreateCoffee(@Body() createCoffeDto: CreateCoffeeDto): any {
    return this.coffeeService.addCoffee(createCoffeDto);
  }
  @Get()
  async getAvailableCoffee() {
    const coffeee = await this.coffeeService.getCoffee();
    return coffeee;
  }

  @Get(':id')
  async getCoffeeById(@Param('id') coffeeId: string) {
    const coffee = await this.coffeeService.getSingleCoffee(coffeeId);
    return coffee;
  }

  @Patch(':id')
  async updateCoffee(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    const coffee = await this.coffeeService.updateCoffee(updateCoffeeDto);
    return coffee;
  }
  @Delete(':id')
  async deleteCoffee(
    @Param('id') coffeeId: string,
    @Body('reason') reason: string,
  ) {
    const response = await this.coffeeService.deleteCoffee(coffeeId);
    return `Coffee deleted due to ${reason}`;
  }
}
