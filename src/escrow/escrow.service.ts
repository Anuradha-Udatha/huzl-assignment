import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, startSession } from 'mongoose';
import { Escrow } from './schemas/escrow.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class EscrowService {
  constructor(
    @InjectModel(Escrow.name) private escrowModel: Model<Escrow>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async fundEscrow(senderId: string, recipientId: string, amount: number) {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      
      const sender = await this.userModel.findById(senderId).session(session);
      if (!sender) throw new NotFoundException('Sender not found');
      if (sender.walletBalance < amount) throw new BadRequestException('Insufficient balance');

      
      sender.walletBalance -= amount;
      await sender.save({ session });

      
      const escrow = new this.escrowModel({ senderId, recipientId, amount, status: 'funded' });
      await escrow.save({ session });

      await session.commitTransaction();
      return { message: 'Escrow funded successfully', escrow };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async releaseEscrow(escrowId: string) {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const escrow = await this.escrowModel.findById(escrowId).session(session);
      if (!escrow) throw new NotFoundException('Escrow not found');
      if (escrow.status !== 'funded') throw new BadRequestException('Invalid escrow state');

  
      const recipient = await this.userModel.findById(escrow.recipientId).session(session);
      if (!recipient) throw new NotFoundException('Recipient not found');

      
      recipient.walletBalance += escrow.amount;
      await recipient.save({ session });

     
      escrow.status = 'released';
      await escrow.save({ session });

      await session.commitTransaction();
      return { message: 'Escrow released successfully', escrow };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async refundEscrow(escrowId: string) {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      
      const escrow = await this.escrowModel.findById(escrowId).session(session);
      if (!escrow) throw new NotFoundException('Escrow not found');
      if (escrow.status !== 'funded') throw new BadRequestException('Escrow is not refundable');

      
      const sender = await this.userModel.findById(escrow.senderId).session(session);
      if (!sender) throw new NotFoundException('Sender not found');

      
      sender.walletBalance += escrow.amount;
      await sender.save({ session });

      escrow.status = 'refunded';
      await escrow.save({ session });

      await session.commitTransaction();
      return { message: 'Escrow refunded successfully', escrow };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
