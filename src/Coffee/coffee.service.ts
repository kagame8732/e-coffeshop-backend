/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './coffee.model';
import { CreateCoffeeDto } from './create-coffee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCoffeeDto } from './update-coffee.dto';

@Injectable()
export class CoffeeServices {
  private coffee: Coffee[] = [];

  constructor(
    @InjectModel('Coffee') private readonly coffeeModel: Model<Coffee>,
  ) {}

  async addCoffee(createCoffeeDto: CreateCoffeeDto) {
    const { name, description, category, price } = createCoffeeDto;
    // Check if a coffee with the same name already exists
    const existingCoffee = await this.coffeeModel.findOne({ name });

    if (existingCoffee) {
      throw new Error('A coffee with this name already exists.');
    }

    // If no coffee with the same name exists, create and save the new coffee
    const newCoffee = new this.coffeeModel({
      name,
      description,
      category,
      price,
    });

    const result = await newCoffee.save();
    return result;
  }

  async getCoffee() {
    const coffee = await this.coffeeModel.find().exec();
    return coffee as Coffee[];
  }

  async getSingleCoffee(coffeeid: string) {
    const coffee = await this.findCoffee(coffeeid);
    return coffee;
  }

  private async findCoffee(id: string): Promise<Coffee> {
    let coffee;
    try {
      coffee = await this.coffeeModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Coffee not Found.');
    }

    if (!coffee) {
      throw new NotFoundException('Coffee not Found.');
    }
    return coffee;
  }

  async updateCoffee(updateCoffeeDto: UpdateCoffeeDto) {
    const { id, name, description, category, price } = updateCoffeeDto;
    const updateCoffee = await this.findCoffee(id);

    if (name) {
      updateCoffee.name = name;
    }
    if (description) {
      updateCoffee.description = description;
    }
    if (category) {
      updateCoffee.category = category;
    }
    if (price) {
      updateCoffee.price = price;
    }
    updateCoffee.save();
    return updateCoffee;
  }

  async deleteCoffee(coffeeId: string) {
    const coffee = await this.coffeeModel.findByIdAndDelete(coffeeId);
    if (!coffee) {
      throw new NotFoundException('Coffee not Found');
    }
    return 'Coffee Removed Successfully!';
  }
}
