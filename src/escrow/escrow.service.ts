import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Escrow } from './schemas/escrow.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class EscrowService {
  constructor(
    @InjectModel(Escrow.name) private escrowModel: Model<Escrow>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async fundEscrow(senderId: string, recipientId: string, amount: number) {
    const sender = await this.userModel.findById(senderId);
    if (!sender) {
        throw new Error('User not found');
    }
    if (sender.walletBalance < amount) throw new Error('Insufficient balance');

    sender.walletBalance -= amount;
    await sender.save();

    const escrow = new this.escrowModel({
      senderId,
      recipientId,
      amount,
    });
    return escrow.save();
  }

  async releaseEscrow(escrowId: string) {
    const escrow = await this.escrowModel.findById(escrowId);
    if (!escrow || escrow.status !== 'funded') throw new Error('Invalid escrow');

    const recipient = await this.userModel.findById(escrow.recipientId);
    if (!recipient) {
        throw new Error('User not found');
    }
    recipient.walletBalance += escrow.amount;
    await recipient.save();

    escrow.status = 'released';
    return escrow.save();
  }

  async refundEscrow(escrowId: string) {
    const escrow = await this.escrowModel.findById(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }
    if (escrow.status === 'released') {
      throw new Error('Escrow has already been released. No refund possible.');
    }
    if (escrow.status === 'refunded') {
      throw new Error('Escrow has already been refunded.');
    }
    if (escrow.status !== 'funded') {
      throw new Error('Escrow is not in a refundable state.');
    }
    const sender = await this.userModel.findById(escrow.senderId);
    if (!sender) {
      throw new Error('Sender not found');
    } 
    sender.walletBalance += escrow.amount; 
    await sender.save();
    escrow.status = 'refunded';
    await escrow.save();
    return { message: 'Escrow refunded successfully', escrow };
  }
  
}

  