import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('add')
  async addFunds(@Body('userId') userId: string, @Body('amount') amount: number) {
    return this.walletService.addFunds(userId, amount);
  }

  @Post('withdraw')
  async withdrawFunds(
    @Body('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    return this.walletService.withdrawFunds(userId, amount);
  }

  @Get('balance/:userId')
  async getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }
}