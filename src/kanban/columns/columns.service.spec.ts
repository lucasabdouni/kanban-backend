import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TesteUtil from '../../common/test/TestUtil';
import { ColumnTable } from './columns.entity';
import { ColumnsService } from './columns.service';

describe('ColumnsService', () => {
  let service: ColumnsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsService,
        {
          provide: getRepositoryToken(ColumnTable),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search all columns', () => {
    it('should be list all columns', async () => {
      const column = TesteUtil.giveAMeAValidColumn();
      mockRepository.find.mockReturnValue([column, column]);

      const columns = await service.findAllColumns();

      expect(columns).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Column By Id', () => {
    it('should find a existing column', async () => {
      const column = TesteUtil.giveAMeAValidColumn();
      mockRepository.findOne.mockReturnValue(column);
      const columnFound = await service.findColumnById('1');

      expect(columnFound).toMatchObject({ title: column.title });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a expection when does not find a column', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findColumnById('3')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create column', () => {
    it('should create a column', async () => {
      const column = TesteUtil.giveAMeAValidColumn();
      mockRepository.save.mockReturnValue(column);
      mockRepository.create.mockReturnValue(column);

      const savedColumn = await service.createColumn(column);
      expect(savedColumn).toMatchObject(column);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should return a expection when doesnt create a column', async () => {
      const column = TesteUtil.giveAMeAValidColumn();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(column);

      await service.createColumn(column).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Error when creating a new column.',
        });
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        expect(mockRepository.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('When update Column', () => {
    it('should update a Column', async () => {
      const column = TesteUtil.giveAMeAValidColumn();
      const updatedColumn = { title: 'Alter column title' };
      mockRepository.findOne.mockReturnValue(column);

      const resultColumn = await service.updateColumn('1', {
        ...column,
        title: 'Alter column title',
      });

      expect(resultColumn).toMatchObject(updatedColumn);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('When delete Column', () => {
    it('Should delete a existing column', async () => {
      const column = TesteUtil.giveAMeAValidColumn();
      mockRepository.findOne.mockReturnValue(column);
      mockRepository.delete.mockReturnValue(column);

      const deletedColumn = await service.deleteColumn('1');

      expect(deletedColumn).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('Should not delete a inexisting column', async () => {
      const column = TesteUtil.giveAMeAValidColumn();
      mockRepository.findOne.mockReturnValue(column);
      mockRepository.delete.mockReturnValue(null);

      const deletedColumn = await service.deleteColumn('8');

      expect(deletedColumn).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
