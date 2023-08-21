import { Injectable,ConflictException,BadRequestException  } from '@nestjs/common';
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
  async signUp(signUpDto): Promise<{ token: string,message:string,user:any }> {
   try {
    const { name, email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

     // Check if the user table is empty
     const usersCount = await this.userModel.countDocuments({});
     // If the user table is empty, the first user to be created will be an admin
     const userRole = usersCount === 0 ? 1 : 2;
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    const token = this.jwtService.sign({ id: user._id });
    return { token ,message:'User created successfully',user};
   } catch (error) {
    return error.response;
   }
  }





}
