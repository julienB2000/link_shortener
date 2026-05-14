import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

describe('LinksController', () => {
  let controller: LinksController;
  let mockService: { shortenerUrl: ReturnType<typeof vi.fn>; returnUrlByCode: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockService = {
      shortenerUrl: vi.fn(),
      returnUrlByCode: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [{ provide: LinksService, useValue: mockService }],
    }).compile();

    controller = module.get<LinksController>(LinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('postUrl', () => {
    it('should call shortenerUrl with the url and return the created link', async () => {
      const mockLink = { id: 1, url: 'https://example.com', shortCode: 'abc123', createdAt: new Date() };
      mockService.shortenerUrl.mockResolvedValue(mockLink);

      const result = await controller.postUrl({ url: 'https://example.com' });

      expect(mockService.shortenerUrl).toHaveBeenCalledWith('https://example.com');
      expect(result).toEqual(mockLink);
    });
  });

  describe('getUrl', () => {
    it('should return a redirect object when the code exists', async () => {
      const mockLink = { id: 1, url: 'https://example.com', shortCode: 'abc123', createdAt: new Date() };
      mockService.returnUrlByCode.mockResolvedValue(mockLink);

      const result = await controller.getUrl('abc123');

      expect(mockService.returnUrlByCode).toHaveBeenCalledWith('abc123');
      expect(result).toEqual({ url: 'https://example.com', statusCode: 302 });
    });

    it('should throw NotFoundException when the code does not exist', async () => {
      mockService.returnUrlByCode.mockResolvedValue(undefined);

      await expect(controller.getUrl('notfound')).rejects.toThrow(NotFoundException);
    });
  });
});
