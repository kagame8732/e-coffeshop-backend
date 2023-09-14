import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, VerifyDto } from './dto/';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleOauthGuard } from './guards/guard.google';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';

const cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 1000 * 60 * 60),
};
@ApiTags('Authentification')
@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  // SIGNUP
  @ApiOperation({ summary: 'Signup the client' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post('/signup')
  async signUp(
    @Body(new ValidationPipe()) signUpDto: SignUpDto,
  ): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  //LOGIN
  @ApiResponse({
    status: 201,
    description: 'Welcome back John, Login successful',
  })
  @ApiOperation({ summary: 'Signin the client' })
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const response = await this.authService.login(loginDto);
    if (response.token) {
      const token = response.token;
      res.setHeader('Authorization', `Bearer ${response.token}`);
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('jwt', token, cookieOptions),
      );
    }
    res.send(response);
  }
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = this.jwtService.sign({ id: req.user._id });
    res.cookie('jwt', token, {
      secure: false,
      maxAge: 3600,
    });
    res.send('Google OAuth successful! Welcome ' + req.user.name);
  }

  //VERIFY
  @ApiResponse({
    status: 201,
    description: 'Welcome back John, Login successful',
  })
  @ApiOperation({ summary: 'Check for validation code' })
  @Post('/verify')
  async verify(@Body() verifyDto: VerifyDto): Promise<{ token?: string }> {
    return this.authService.verify2FACode(verifyDto);
  }
}
