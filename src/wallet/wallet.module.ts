// src/wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    MongooseModule, 
    AuthModule,  
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
