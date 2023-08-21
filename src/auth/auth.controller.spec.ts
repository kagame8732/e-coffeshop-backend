import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should create a user and return a token', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 2, 
      };

      const mockResponse = {
        token: 'mockToken',
        message: 'User created successfully',
        user: {
          _id: 'mockUserId',
          name: 'John Doe',
          email: 'john@example.com',
          role: 2,
        },
      };

      mockAuthService.signUp.mockResolvedValue(mockResponse);

      const result = await authController.signUp(signUpDto);

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors during user creation', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 2, // Add the role property
      };

      const errorMessage = 'Something went wrong';
      mockAuthService.signUp.mockRejectedValue(new BadRequestException(errorMessage));

      await expect(authController.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });
  });
});
