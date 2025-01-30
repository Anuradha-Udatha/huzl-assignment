import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscrowService } from './escrow.service';
import { EscrowController } from './escrow.controller';
import { AuthModule } from '../auth/auth.module';
import { Escrow, EscrowSchema } from './schemas/escrow.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';  
import { TransactionLog,TransactionLogSchema } from 'src/transactions/schemas/transaction-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Escrow.name, schema: EscrowSchema },
      { name: User.name, schema: UserSchema },  
      { name: TransactionLog.name, schema: TransactionLogSchema }
    ]),
    AuthModule, 
  ],
  providers: [EscrowService],
  controllers: [EscrowController],
})
export class EscrowModule {}