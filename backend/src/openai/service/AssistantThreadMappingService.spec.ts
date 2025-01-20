import { AssistantThreadMappingService } from './AssistantThreadMappingService';
import { ThreadMappingPort } from '../domain/ports/ThreadMappingPort';
import { ThreadMapping } from '../domain/model/ThreadMapping';
import { CreateThreadMappingDto } from '../domain/dto/CreateThreadMappingDto';

describe(AssistantThreadMappingService.name, () => {
  const mockThreadMappingRepo = {
    findByAssistantThreadId: jest.fn(),
    findBySlackThreadId: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<ThreadMappingPort>;

  const service = new AssistantThreadMappingService(mockThreadMappingRepo);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe(AssistantThreadMappingService.prototype.findByAssistantThreadId.name, () => {
    it('should return a ThreadMapping when found', async () => {
      const assistantThreadId = 'assistant-thread-id';
      const mockMapping: ThreadMapping = {
        assistantThreadId,
        slackThreadId: 'slack-thread-id',
        type: 'SLACK',
      };

      mockThreadMappingRepo.findByAssistantThreadId.mockResolvedValue(mockMapping);

      const result = await service.findByAssistantThreadId(assistantThreadId);

      expect(mockThreadMappingRepo.findByAssistantThreadId).toHaveBeenCalledWith(assistantThreadId);
      expect(result).toEqual(mockMapping);
    });
  });

  describe(AssistantThreadMappingService.prototype.findBySlackThreadId.name, () => {
    it('should return a ThreadMapping when found', async () => {
      const slackThreadId = 'slack-thread-id';
      const mockMapping: ThreadMapping = {
        assistantThreadId: 'assistant-thread-id',
        slackThreadId,
        type: 'SLACK',
      };

      mockThreadMappingRepo.findBySlackThreadId.mockResolvedValue(mockMapping);

      const result = await service.findBySlackThreadId(slackThreadId);

      expect(mockThreadMappingRepo.findBySlackThreadId).toHaveBeenCalledWith(slackThreadId);
      expect(result).toEqual(mockMapping);
    });
  });

  describe(AssistantThreadMappingService.prototype.saveMapping.name, () => {
    it('should save a ThreadMapping and return the saved mapping', async () => {
      const createDto: CreateThreadMappingDto = {
        assistantThreadId: 'assistant-thread-id',
        slackThreadId: 'slack-thread-id',
        createdBy: 'user-id',
        type: 'SLACK',
      };

      const mockMapping: ThreadMapping = {
        ...createDto,
      };

      mockThreadMappingRepo.save.mockResolvedValue(mockMapping);

      const result = await service.saveMapping(createDto);

      expect(mockThreadMappingRepo.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockMapping);
    });
  });
});
