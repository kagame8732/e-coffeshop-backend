import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlavorService } from './flavors.service';
import { FlavorRepository } from './flavors.repository';
import { Flavor, FlavorSchema } from './flavors.schema';
import { FlavorsController } from './flovors.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flavor.name, schema: FlavorSchema }]),
    JwtModule,
  ],
  providers: [FlavorRepository, FlavorService],
  controllers: [FlavorsController],
})
export class FlavorModule {}
