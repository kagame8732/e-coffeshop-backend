import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CoffeeServices } from './coffee.service';
import { CreateCoffeeDto } from './create-coffee.dto';
import { ApiTags,ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateCoffeeDto } from './update-coffee.dto';
import { IsAdmin } from 'src/guards/isAdmin.guard';

@ApiTags('Coffee')
@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeServices) {}
  @ApiOperation({ summary: 'Create a new coffee' })
  // SWAGGER JWT AUTH
  @ApiBearerAuth('jwt')
  // TO USE GUARD FOR CHECKING IF USER IS ADMIN
  @UseGuards(IsAdmin)
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
  @ApiBearerAuth('jwt')
  @UseGuards(IsAdmin)
  @Patch(':id')
  async updateCoffee(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    const coffee = await this.coffeeService.updateCoffee(updateCoffeeDto);
    return coffee;
  }
  @ApiOperation({ summary: 'Delete a single coffee' })
  @ApiBearerAuth('jwt')
  @UseGuards(IsAdmin)
  @Delete(':id')
  async deleteCoffee(
    @Param('id') coffeeId: string,
    @Body('reason') reason: string,
  ) {
    const response = await this.coffeeService.deleteCoffee(coffeeId);
    return `Coffee deleted due to ${reason}`;
  }
}
