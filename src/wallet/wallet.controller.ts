import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';


@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('add')
  async addFunds(@Req() req: AuthenticatedRequest, @Body('amount') amount: number) {
    if (!req.user || !req.user._id) {
      throw new Error('Unauthorized access');
    }
    return this.walletService.addFunds(req.user._id.toString(), amount);
  }

  @Post('withdraw')
  async withdrawFunds(@Req() req: AuthenticatedRequest, @Body('amount') amount: number) {
    if (!req.user || !req.user._id) {
      throw new Error('Unauthorized access');
    }
    return this.walletService.withdrawFunds(req.user._id.toString(), amount);
  }

  @Get('balance')
  async getBalance(@Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user._id) {
      throw new Error('Unauthorized access');
    }
    return this.walletService.getBalance(req.user._id.toString());
  }
}