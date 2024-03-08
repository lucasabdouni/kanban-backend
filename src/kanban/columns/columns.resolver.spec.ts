import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsResolver } from './columns.resolver';

describe('ColumnsResolver', () => {
  let resolver: ColumnsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColumnsResolver],
    }).compile();

    resolver = module.get<ColumnsResolver>(ColumnsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
