import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockDb: any;
  let mockJwtService: { sign: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    };

    mockJwtService = { sign: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'DATABASE_CONNECTION', useValue: mockDb },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash the password and return id + email', async () => {
      mockDb.limit.mockResolvedValue([]);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password' as never);
      mockDb.returning.mockResolvedValue([{ id: 1, email: 'test@example.com' }]);

      const result = await service.register('test@example.com', 'password123');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should throw ConflictException when email is already taken', async () => {
      mockDb.limit.mockResolvedValue([{ id: 1, email: 'test@example.com' }]);

      await expect(service.register('test@example.com', 'password123')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return an access_token when credentials are valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com', hashedPassword: 'hashed' };
      mockDb.limit.mockResolvedValue([mockUser]);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login('test@example.com', 'password123');

      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 1, email: 'test@example.com' });
      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should throw UnauthorizedException when email does not exist', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(service.login('unknown@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      const mockUser = { id: 1, email: 'test@example.com', hashedPassword: 'hashed' };
      mockDb.limit.mockResolvedValue([mockUser]);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
