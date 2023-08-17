import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Flavor {
  @Prop()
  name: string;

  @Prop()
  ingredients: string[];
}

export const FlavorSchema = SchemaFactory.createForClass(Flavor);
