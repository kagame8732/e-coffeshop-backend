import { Injectable } from '@nestjs/common';
import { CreateFlavorDto, ResponseFlavorDto } from './flavors.dto';
import { FlavorRepository } from './flavors.repository';

@Injectable()
export class FlavorService {
  constructor(private flavorRepository: FlavorRepository) {}

  async create(createFlavorDto: CreateFlavorDto): Promise<ResponseFlavorDto> {
    return this.flavorRepository.create(createFlavorDto);
  }

  async findAll(): Promise<ResponseFlavorDto[]> {
    return this.flavorRepository.findAll();
  }

  async findOne(name: string): Promise<ResponseFlavorDto> {
    return this.flavorRepository.findOne(name);
  }

  async findById(id: string): Promise<ResponseFlavorDto> {
    return this.flavorRepository.findById(id);
  }
}
