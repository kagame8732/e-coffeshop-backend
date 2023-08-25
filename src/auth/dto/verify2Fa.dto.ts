import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// VALIDATION FOR SIGNUP
export class VerifyDto {
  @ApiProperty({ description: 'The email of the client', type: String })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @ApiProperty({ description: 'The code of the client', type: Number })
  @IsNotEmpty()
  code: number;
}
