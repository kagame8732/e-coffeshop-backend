import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Coffee } from 'src/coffee/coffee.model';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coffee' })
  coffee: Coffee;

  @ApiProperty()
  @Prop()
  quantity: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
