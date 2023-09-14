import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Coffee } from 'src/coffee/coffee.model';
import { User } from 'src/auth/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coffee' })
  coffee: Coffee;
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @ApiProperty()
  @Prop()
  quantity: number;
  @ApiProperty()
  @Prop()
  payment_url: string;
  @ApiProperty()
  @Prop()
  status: 'completed' | 'failed' | 'pending';
}

export const OrderSchema = SchemaFactory.createForClass(Order);
