import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// VALIDATION FOR SIGNUP
export class SignUpDto {
  @ApiProperty({ description: 'The name of the client',type:String })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'The email of the client',type:String })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @ApiProperty({ description: 'The password of the client',type:String})
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @ApiProperty({ description: 'The role of the client',default:2 })
  @IsNumber()
  role: number;
}
