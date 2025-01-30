import { Controller, Get, UseGuards, Req } from '@nestjs/common'; 
import { TransactionLogService } from '../transactions/transactions.service';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionLogController {
  constructor(private readonly transactionLogService: TransactionLogService) {}

  @UseGuards(JwtAuthGuard) 
  @Get()
  async getTransactions(@Req() req: AuthenticatedRequest) { 
    const userId = req.user._id; 
    const transactions = await this.transactionLogService.getTransactionsByUser(userId);
    return transactions;
  }
}