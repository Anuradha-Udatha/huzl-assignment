// transactions/transaction-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionLog } from './schemas/transaction-log.schema';

@Injectable()
export class TransactionLogService {
  constructor(
    @InjectModel(TransactionLog.name) private readonly transactionLogModel: Model<TransactionLog>,
  ) {}

  async getTransactionsByUser(userId: string) {
    return this.transactionLogModel.find({ userId }).exec();
  }
}
