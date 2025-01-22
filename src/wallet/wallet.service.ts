import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class WalletService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async addFunds(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.walletBalance += amount;
    return user.save();
  }

  async withdrawFunds(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.walletBalance < amount) throw new Error('Insufficient balance');
    user.walletBalance -= amount;
    return user.save();
  }

  async getBalance(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.walletBalance;
  }
}