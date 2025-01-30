import { Test, TestingModule } from '@nestjs/testing';
import { TransactionLogController } from './transactions.controller';

describe('TransactionsController', () => {
  let controller: TransactionLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionLogController],
    }).compile();

    controller = module.get<TransactionLogController>(TransactionLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
