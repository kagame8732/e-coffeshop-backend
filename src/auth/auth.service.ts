import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as speakeasy from 'speakeasy';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; message: string; user: any }> {
    try {
      const { name, email, password } = signUpDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const theUser = await this.userModel.findOne({ email });
      if (theUser) {
        throw new ConflictException('User already exists');
      }

      // CHECK IF THEY ARE THE FIRST USER TO BE CREATED
      const usersCount = await this.userModel.countDocuments({});
      const userRole = usersCount === 0 ? 1 : 2;
      if (userRole === 2) {
        // IF THEY ARE NOT THE FIRST USER, GIVE THEM CUSTOMER ROLE
        const user = await this.userModel.create({
          name,
          email,
          password: hashedPassword,
          role: userRole,
        });

        const token = this.jwtService.sign({ id: user._id });
        return { token, message: 'User created successfully', user };
      } else {
        // IF THEY ARE THE FIRST USER, GIVE THEM ADMIN ROLE
        const temp_secret = speakeasy.generateSecret();
        const user = await this.userModel.create({
          name,
          email,
          password: hashedPassword,
          role: userRole,
          secretKey: temp_secret.base32,
        });
        const token = this.jwtService.sign({
          id: user._id,
          role: user.role,
          email: user.email,
        });
        return { token, message: 'User created successfully', user };
      }
    } catch (error) {
      return error.response;
    }
  }

  async login(loginDto): Promise<{ token?: string; message: string }> {
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
      // CHECK IF 2 FACTOR AUTH IS ENABLED , IF NOT, LOGIN
      if (user.role === 2) {
        const token = this.jwtService.sign({
          id: user._id,
          role: user.role,
          email: user.email,
        });
        return {
          message: `Welcome back ${user.name}. Login successful!`,
          token,
        };
      } else {
        // IF 2 FACTOR AUTH IS ENABLED FOR THE USER, SEND THEM A CODE
        const secret = speakeasy.generateSecret();
        const verificationCode = speakeasy.hotp({
          secret: secret.base32,
          digits: 6,
          encoding: 'base32',
          counter: 45,
        });
        await this.userModel.findOneAndUpdate(
          { email },
          { secretKey: secret.base32 },
        );
        await this.mailService.sendUserConfirmation(
          user.name,
          verificationCode,
          email,
        );
        return { message: `Check you Email for the Code ` };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.response);
    }
  }
  async verify2FACode(verifyDto): Promise<{ token: string; message: string }> {
    try {
      const { email, code } = verifyDto;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException('Invalid credentials (email)');
      }
      // VERIFY THE CODE WITH THE USER SECRETKEY AND THE CODE THEY ENTERED
      const secret = user.secretKey;
      const verified = speakeasy.totp.verify({
        secret: secret,
        token: code,
        encoding: 'base32',
        counter: 45,
        digits: 6,
        window: 10,
      });
      if (verified) {
        const token = this.jwtService.sign({
          id: user._id,
          role: user.role,
          email: user.email,
        });

        return {
          token: token,
          message: `Welcome back ${user.name}. Login successful!`,
        };
      } else {
        throw new BadRequestException('Invalid credentials (code)');
      }
    } catch (error) {
      return error.response;
    }
  }
}
