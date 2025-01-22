import { Controller, Post, Body,UseGuards } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('escrow')
export class EscrowController {
  constructor(private escrowService: EscrowService) {}

  @Post('fund')
  async fundEscrow(
    @Body('senderId') senderId: string,
    @Body('recipientId') recipientId: string,
    @Body('amount') amount: number,
  ) {
    return this.escrowService.fundEscrow(senderId, recipientId, amount);
  }

  @Post('release')
  async releaseEscrow(@Body('escrowId') escrowId: string) {
    return this.escrowService.releaseEscrow(escrowId);
  }

  @Post('refund')
  async refundEscrow(@Body('escrowId') escrowId: string) {
    return this.escrowService.refundEscrow(escrowId);
  }
}