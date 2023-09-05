import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;
  @Prop({ unique: [true, 'Email $value already exists'] })
  email: string;
  @Prop()
  password: string;
  @Prop({ default: 2 })
  role: number;
  @Prop({ default: '' })
  secretKey: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
