import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { TransactionLog } from '../transactions/schemas/transaction-log.schema';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TransactionLog.name) private readonly transactionLogModel: Model<TransactionLog>,
  ) {}

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  private validateAmount(amount: any) {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }
  }

  async addFunds(userId: string, amount: any): Promise<User> {
    this.validateObjectId(userId);
    this.validateAmount(amount);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.walletBalance += amount;
    const updatedUser = await user.save();

    await this.transactionLogModel.create({
      userId: userId,
      type: 'add',
      amount,
      balanceAfter: updatedUser.walletBalance,
    });

    return updatedUser;
  }

  async withdrawFunds(userId: string, amount: any): Promise<User> {
    this.validateObjectId(userId);
    this.validateAmount(amount);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.walletBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    user.walletBalance -= amount;
    const updatedUser = await user.save();

    await this.transactionLogModel.create({
      userId: userId,
      type: 'withdrawal',
      amount,
      balanceAfter: updatedUser.walletBalance,
    });

    return updatedUser;
  }


  async getBalance(userId: string): Promise<number> {
    this.validateObjectId(userId);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.walletBalance;
  }
}
