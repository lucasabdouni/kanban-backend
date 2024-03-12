import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hashPasswordTransform } from '../common/helpers/crypto';
import TesteUtil from '../common/test/TestUtil';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

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
      imports: [
        JwtModule.register({
          secret: 'jwt-token-teste',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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

  describe('When validated user', () => {
    it('should be valid user', async () => {
      const user = TesteUtil.giveAMeAValidUser();

      const hashedPassword = hashPasswordTransform.to(user.password);
      const userWithHashedPassword = { ...user, password: hashedPassword };

      mockRepository.findOne.mockReturnValue(userWithHashedPassword);

      const valited = await service.validateUser({
        email: user.email,
        password: user.password,
      });

      expect(valited.token).toEqual(expect.any(String));
    });

    it('should not be possible to validate a user with an invalid password', async () => {
      const user = TesteUtil.giveAMeAValidUser();

      const hashedPassword = hashPasswordTransform.to(user.password);
      const userWithHashedPassword = { ...user, password: hashedPassword };

      mockRepository.findOne.mockReturnValue(userWithHashedPassword);

      const data = {
        email: user.email,
        password: '123123',
      };

      await service.validateUser(data).catch((e) => {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e).toMatchObject({
          message: 'Incorrect Password',
        });
      });
    });
  });
});
