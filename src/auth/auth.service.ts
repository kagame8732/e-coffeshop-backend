import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpDto): Promise<{ token: string; message: string; user: any}> {
    try {
      const { name, email, password } = signUpDto;
      const hashedPassword = await bcrypt.hash(password, 10);


      if (password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      const emailRegex =
        /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;
      const validateEmail = emailRegex.test(email);
      if (!validateEmail) {
        throw new BadRequestException('Email is not valid');
      }
      
   
      // Check if the user table is empty
      const usersCount = await this.userModel.countDocuments({});

      // If the user table is empty, the first user to be created will be an admin
      const userRole = usersCount === 0 ? 1 : 2;
      const userExist = await this.userModel.findOne({ email });
      if (userExist) {
        throw new ConflictException('Email already exist');
      }
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role: userRole,
      });

      const token = this.jwtService.sign({ id: user._id });
      return { token, message: 'User created successfully', user };
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  async login(loginDto): Promise<{ token: string; message: string }> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new BadRequestException('Invalid credentials (email)');
      }

      const isPasswordValid = await bcrypt.compare(password, user?.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials (password)');
      }

      const token = this.jwtService.sign({
        id: user._id,
        name: user.email,
        email: user.email,
      });

      return { message: `Welcome back ${user.name}. Login successful!`, token };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.response);
    }
  }
}
