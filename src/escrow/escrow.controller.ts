import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Req, 
  BadRequestException, 
  UnauthorizedException 
} from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@UseGuards(JwtAuthGuard)
@Controller('escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post('fund')
  async fundEscrow(
    @Req() req: AuthenticatedRequest,
    @Body() body: { recipientId: string; amount: number },
  ) {

    if (!body.recipientId || typeof body.recipientId !== 'string' || 
        !body.amount || typeof body.amount !== 'number') {
      throw new BadRequestException('Invalid recipientId or amount');
    }
    const senderId = req.user._id;
    if (!senderId) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (senderId.toString() === body.recipientId) {
      throw new BadRequestException('Cannot create escrow for yourself');
    }

    return this.escrowService.fundEscrow(
      senderId.toString(),
      body.recipientId,
      body.amount
    );
  }

  @Post('release')
  async releaseEscrow(@Body('escrowId') escrowId: string) {
    if (!escrowId || typeof escrowId !== 'string') {
      throw new BadRequestException('Invalid escrowId');
    }
    
    return this.escrowService.releaseEscrow(escrowId);
  }

  @Post('refund')
  async refundEscrow(@Body('escrowId') escrowId: string) {
    if (!escrowId || typeof escrowId !== 'string') {
      throw new BadRequestException('Invalid escrowId');
    }
    
    return this.escrowService.refundEscrow(escrowId);
  }
}
