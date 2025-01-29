import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('escrow')
export class EscrowController {
  constructor(private escrowService: EscrowService) {}

  @Post('fund')
  async fundEscrow(
    @Req() req: AuthenticatedRequest, 
    @Body('recipientId') recipientId: string,
    @Body('amount') amount: number,
  ) {
    const senderId = req.user?._id.toString(); 
    if (!senderId) {
      throw new Error('Unauthorized access');
    }
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
