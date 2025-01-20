import { Repository, IsNull, EntityNotFoundError } from 'typeorm';

import { ThreadMappingTypeormRepository } from './ThreadMappingTypeormRepository';
import { ThreadMappingEntity } from '../entities/ThreadMappingEntity';
import { CreateThreadMappingDto } from '@app/openai/domain/dto/CreateThreadMappingDto';
import { ThreadMappingType } from '@app/openai/domain/model/ThreadMappingType';

const slackThreadId = 'slack-thread-id';
const assistantThreadId = 'assistant-thread-id';
const userId = 'user-id';
const type = ThreadMappingType.SLACK;

describe(ThreadMappingTypeormRepository.name, () => {
  const mockRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<ThreadMappingEntity>>;

  const service = new ThreadMappingTypeormRepository(
    mockRepo,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe(ThreadMappingTypeormRepository.prototype.findBySlackThreadId.name, () => {
    it('should return a ThreadMapping when found', async () => {
      const mockEntity = new ThreadMappingEntity();

      mockEntity.slackThreadId = slackThreadId;
      mockEntity.assistantThreadId = assistantThreadId;

      mockRepo.findOneBy.mockResolvedValue(mockEntity);

      const result = await service.findBySlackThreadId(slackThreadId);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        slackThreadId,
        deletedAt: IsNull(),
      });

      expect(result).toEqual(ThreadMappingEntity.toDomainModel(mockEntity));
    });

    it('should return null if no mapping is found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      const result = await service.findBySlackThreadId(slackThreadId);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        slackThreadId,
        deletedAt: IsNull(),
      });

      expect(result).toBeNull();
    });
  });

  describe(ThreadMappingTypeormRepository.prototype.findByAssistantThreadId.name, () => {
    it('should return a ThreadMapping when found', async () => {
      const mockEntity = new ThreadMappingEntity();

      mockEntity.assistantThreadId = assistantThreadId;
      mockEntity.slackThreadId = slackThreadId;

      mockRepo.findOneBy.mockResolvedValue(mockEntity);

      const result = await service.findByAssistantThreadId(assistantThreadId);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        assistantThreadId,
        deletedAt: IsNull(),
      });

      expect(result).toEqual(ThreadMappingEntity.toDomainModel(mockEntity));
    });

    it('should throw EntityNotFound if no mapping is found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findByAssistantThreadId(assistantThreadId)).rejects.toThrow(
        new EntityNotFoundError(ThreadMappingEntity.name, assistantThreadId),
      );

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        assistantThreadId,
        deletedAt: IsNull(),
      });
    });
  });

  describe(ThreadMappingTypeormRepository.prototype.save.name, () => {
    it('should save a ThreadMapping and return the domain model', async () => {
      const createDto: CreateThreadMappingDto = {
        slackThreadId,
        assistantThreadId,
        createdBy: userId,
        type,
      };

      const mockEntity = ThreadMappingEntity.fromCreateDto(createDto);

      mockRepo.save.mockResolvedValue(mockEntity);

      const result = await service.save(createDto);

      expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(ThreadMappingEntity.toDomainModel(mockEntity));
    });

    it('should rethrow an error if save fails', async () => {
      const createDto: CreateThreadMappingDto = {
        slackThreadId,
        assistantThreadId,
        createdBy: userId,
        type,
      };

      const mockEntity = ThreadMappingEntity.fromCreateDto(createDto);
      const mockError = new Error('Database save error');

      mockRepo.save.mockRejectedValue(mockError);

      await expect(service.save(createDto)).rejects.toThrow(mockError);

      expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
    });
  });
});
