import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import randtoken from 'rand-token';
import * as schema from '../db/schema';
import { LinksService } from './links.service';

vi.mock('rand-token', () => ({
  default: { generate: vi.fn() },
}));

describe('LinksService', () => {
  let service: LinksService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        { provide: 'DATABASE_CONNECTION', useValue: mockDb },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenerUrl', () => {
    it('should generate a token, insert the link, and return it', async () => {
      const mockLink = { id: 1, url: 'https://example.com', shortCode: 'abc123' };
      vi.mocked(randtoken.generate).mockReturnValue('abc123');
      mockDb.returning.mockResolvedValue([mockLink]);

      const result = await service.shortenerUrl('https://example.com');

      expect(randtoken.generate).toHaveBeenCalledWith(6);
      expect(mockDb.insert).toHaveBeenCalledWith(schema.links);
      expect(mockDb.values).toHaveBeenCalledWith({ url: 'https://example.com', shortCode: 'abc123' });
      expect(result).toEqual(mockLink);
    });

    it('should retry on collision and succeed on second attempt', async () => {
      const mockLink = { id: 1, url: 'https://example.com', shortCode: 'xyz789' };
      vi.mocked(randtoken.generate).mockReturnValue('xyz789');
      mockDb.returning
        .mockRejectedValueOnce(new Error('duplicate key'))
        .mockResolvedValueOnce([mockLink]);

      const result = await service.shortenerUrl('https://example.com');

      expect(mockDb.returning).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockLink);
    });

    it('should throw after 5 failed attempts', async () => {
      vi.mocked(randtoken.generate).mockReturnValue('abc123');
      mockDb.returning.mockRejectedValue(new Error('duplicate key'));

      await expect(service.shortenerUrl('https://example.com')).rejects.toThrow(
        'Failed to generate a unique short code',
      );
      expect(mockDb.returning).toHaveBeenCalledTimes(5);
    });
  });

  describe('returnUrlByCode', () => {
    it('should return the link matching the short code', async () => {
      const mockLink = { id: 1, url: 'https://example.com', shortCode: 'abc123' };
      mockDb.limit.mockResolvedValue([mockLink]);

      const result = await service.returnUrlByCode('abc123');

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.links);
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.limit).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLink);
    });

    it('should return undefined when the code does not exist', async () => {
      mockDb.limit.mockResolvedValue([]);

      const result = await service.returnUrlByCode('notfound');

      expect(result).toBeUndefined();
    });
  });
});
