import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'The email of the client' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'The password of the client' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
