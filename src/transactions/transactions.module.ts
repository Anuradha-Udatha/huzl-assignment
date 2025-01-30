import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLogController } from './transactions.controller';
import { TransactionLogService } from './transactions.service';
import { Escrow, EscrowSchema } from '../escrow/schemas/escrow.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';  
import { TransactionLog,TransactionLogSchema } from 'src/transactions/schemas/transaction-log.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Escrow.name, schema: EscrowSchema },
        { name: User.name, schema: UserSchema },  
        { name: TransactionLog.name, schema: TransactionLogSchema }
      ]),
      AuthModule, 
    ],
  controllers: [TransactionLogController],
  providers: [TransactionLogService]
})
export class TransactionsModule {}
