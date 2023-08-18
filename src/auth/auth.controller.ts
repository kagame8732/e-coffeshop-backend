import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto,LoginDto  } from './dto/';
import { ApiTags,ApiOperation,ApiResponse} from '@nestjs/swagger';
@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Signup the client' })
  @ApiResponse({ status: 201, description: 'User created successfully'})
  @Post('/signup')
  signUp(@Body(new ValidationPipe())  signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }
  @ApiResponse({ status: 201, description: 'Welcome back John, Login successful'})
  @ApiOperation({ summary: 'Signin the client' })
  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
