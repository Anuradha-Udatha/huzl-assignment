import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService, 
  ) {}

  async signup(email: string, password: string) {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    if (!this.isValidPassword(password)) {
      throw new BadRequestException('Password must be at least 8 characters long and contain at least one number');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ 
      email: email.toLowerCase(), 
      password: hashedPassword 
    });
    
    try {
      await user.save();
    } catch (error) {
      throw new BadRequestException('Error creating user account');
    }

    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.sign(payload); 

    const userDetails = {
      email: user.email,
      createdAt: user._id.getTimestamp(),
    };

    return {
      user: userDetails,
      token,
      message: 'User registered successfully'
    };
  }

  async login(email: string, password: string) {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Email not registered');
    }
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Incorrect password');
      }
    } catch (error) {
      throw new UnauthorizedException('Error verifying credentials');
    }
    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.sign(payload); 
    const userDetails = {
      email: user.email,
      createdAt: user._id.getTimestamp(),
    };

    return {
      user: userDetails,
      token,
      message: 'Login successful'
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8 && /\d/.test(password);
  }
}