import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateFlavorDto, IFlavor, ResponseFlavorDto } from './flavors.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Flavor } from './flavors.schema';

@Injectable()
export class FlavorRepository {
  constructor(
    @InjectModel(Flavor.name)
    private flavorModel: Model<IFlavor>,
  ) {}

  async create(createFlavorDto: CreateFlavorDto): Promise<ResponseFlavorDto> {
    return this.flavorModel.create({
      ...createFlavorDto,
    });
  }

  async findAll(): Promise<ResponseFlavorDto[]> {
    return this.flavorModel.find().exec();
  }

  async findById(id: string): Promise<ResponseFlavorDto> {
    return this.flavorModel.findById(id).exec();
  }

  async findOne(name: string): Promise<ResponseFlavorDto> {
    return this.flavorModel.findOne({ name }).exec();
  }
}
