import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Escrow } from './schemas/escrow.schema';
import { User } from '../auth/schemas/user.schema';
import { TransactionLog } from '../transactions/schemas/transaction-log.schema';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class EscrowService {
  constructor(
    @InjectModel(Escrow.name) private readonly escrowModel: Model<Escrow>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TransactionLog.name) private readonly transactionLogModel: Model<TransactionLog>
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

  async fundEscrow(senderId: string, recipientId: string, amount: any) {
    this.validateObjectId(senderId);
    this.validateObjectId(recipientId);
    this.validateAmount(amount);

    const sender = await this.userModel.findById(senderId);
    if (!sender) throw new NotFoundException('Sender not found');

    const recipient = await this.userModel.findById(recipientId);
    if (!recipient) throw new NotFoundException('Recipient not found');

    if (sender.walletBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    sender.walletBalance -= amount;
    await sender.save();

    const escrow = new this.escrowModel({
      senderId,
      recipientId,
      amount,
      status: 'funded',
      createdAt: new Date(),
    });
    await escrow.save();

    await this.transactionLogModel.create({
      userId: senderId,
      type: 'fund',
      amount,
      balanceAfter: sender.walletBalance,
      escrowId: escrow._id
    });

    return {
      message: 'Escrow funded successfully',
      escrow,
      remainingBalance: sender.walletBalance,
    };
  }

  
  async releaseEscrow(escrowId: string) {
    this.validateObjectId(escrowId);

    const escrow = await this.escrowModel.findById(escrowId);
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== 'funded') throw new BadRequestException('Invalid escrow state');

    const recipient = await this.userModel.findById(escrow.recipientId);
    if (!recipient) throw new NotFoundException('Recipient not found');

    recipient.walletBalance += escrow.amount;
    await recipient.save();

    escrow.status = 'released';
    await escrow.save();

    await this.transactionLogModel.create({
      userId: escrow.recipientId,
      type: 'release',
      amount: escrow.amount,
      balanceAfter: recipient.walletBalance,
      escrowId: escrow._id
    });

    return { message: 'Escrow released successfully', escrow };
  }

  async refundEscrow(escrowId: string) {
    this.validateObjectId(escrowId);

    const escrow = await this.escrowModel.findById(escrowId);
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== 'funded') throw new BadRequestException('Escrow is not refundable');

    const sender = await this.userModel.findById(escrow.senderId);
    if (!sender) throw new NotFoundException('Sender not found');

    sender.walletBalance += escrow.amount;
    await sender.save();

    escrow.status = 'refunded';
    await escrow.save();

    await this.transactionLogModel.create({
      userId: sender._id,
      type: 'refund',
      amount: escrow.amount,
      balanceAfter: sender.walletBalance,
      escrowId: escrow._id
    });

    return { message: 'Escrow refunded successfully', escrow };
  }
}
