import { Test, TestingModule } from '@nestjs/testing';
import { TransactionLogService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionLogService],
    }).compile();

    service = module.get<TransactionLogService>(TransactionLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
