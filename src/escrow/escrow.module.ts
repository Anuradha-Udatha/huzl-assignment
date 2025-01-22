import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscrowService } from './escrow.service';
import { EscrowController } from './escrow.controller';
import { AuthModule } from '../auth/auth.module';
import { Escrow, EscrowSchema } from './schemas/escrow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Escrow.name, schema: EscrowSchema }]),
    AuthModule, 
  ],
  providers: [EscrowService],
  controllers: [EscrowController],
})
export class EscrowModule {}
