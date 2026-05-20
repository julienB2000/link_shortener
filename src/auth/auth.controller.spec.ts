import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockService: {
    register: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockService = {
      register: vi.fn(),
      login: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return the created user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockService.register.mockResolvedValue(mockUser);

      const result = await controller.register({ email: 'test@example.com', password: 'password123' });

      expect(mockService.register).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should propagate ConflictException when email is taken', async () => {
      mockService.register.mockRejectedValue(new ConflictException('Email already in use'));

      await expect(
        controller.register({ email: 'taken@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should call authService.login and return the access token', async () => {
      mockService.login.mockResolvedValue({ access_token: 'jwt_token' });

      const result = await controller.login({ email: 'test@example.com', password: 'password123' });

      expect(mockService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should propagate UnauthorizedException on bad credentials', async () => {
      mockService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(
        controller.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
