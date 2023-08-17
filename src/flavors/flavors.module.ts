import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlavorService } from './flavors.service';
import { FlavorRepository } from './flavors.repository';
import { Flavor, FlavorSchema } from './flavors.schema';
import { FlavorsController } from './flovors.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flavor.name, schema: FlavorSchema }]),
  ],
  providers: [FlavorRepository, FlavorService],
  controllers: [FlavorsController],
})
export class FlavorModule {}
