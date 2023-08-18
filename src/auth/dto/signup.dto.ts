import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsAlphanumeric,
  IsNumber,
} from 'class-validator';

// VALIDATION FOR SIGNUP
export class SignUpDto {
  @IsNotEmpty()
  name: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsNumber()
  role: number;
}
