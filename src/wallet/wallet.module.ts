// src/wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { AuthModule } from '../auth/auth.module'; 
import { User,UserSchema } from 'src/auth/schemas/user.schema';
import { TransactionLog,TransactionLogSchema } from 'src/transactions/schemas/transaction-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: TransactionLog.name, schema: TransactionLogSchema }]),
    AuthModule
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
