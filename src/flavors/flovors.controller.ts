import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateFlavorDto, ResponseFlavorDto } from './flavors.dto';
import { FlavorService } from './flavors.service';
import { ApiTags, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IsAdmin } from 'src/guards/isAdmin.guard';

@ApiTags('flavors')
@Controller('flavors')
export class FlavorsController {
  constructor(readonly flavorService: FlavorService) {}
  @ApiBearerAuth('jwt')
  @UseGuards(IsAdmin)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ResponseFlavorDto,
  })
  async create(
    @Body() createFlavorDto: CreateFlavorDto,
  ): Promise<ResponseFlavorDto> {
    return this.flavorService.create(createFlavorDto);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: [ResponseFlavorDto],
  })
  findAll(): Promise<ResponseFlavorDto[]> {
    return this.flavorService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ResponseFlavorDto> {
    return this.flavorService.findById(id);
  }
}
