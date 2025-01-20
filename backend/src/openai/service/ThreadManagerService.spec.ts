import { StructuredLoggerServiceFactory } from '@endpoint/nestjs-core-module';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MessageCreateParams } from 'openai/resources/beta/threads/messages';

import { ThreadManagerService } from './ThreadManagerService';

const existingThreadId = 'existing-thread-id';
const newThreadId = 'new-thread-id';
const messageId = 'message-id';

describe(ThreadManagerService.name, () => {
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>;

  const mockLoggerService = StructuredLoggerServiceFactory.noOpStructuredLoggerService();

  const mockClient = {
    beta: {
      threads: {
        retrieve: jest.fn(),
        create: jest.fn(),
        messages: {
          create: jest.fn(),
        },
      },
    },
  } as unknown as jest.Mocked<OpenAI>;

  let service: ThreadManagerService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockImplementation((key) => {
      if (key === 'OPEN_AI_API_KEY') return 'test-api-key';
      if (key === 'OPEN_AI_PROJECT') return 'test-project';
      if (key === 'OPEN_AI_ORGANIZATION') return 'test-organization';
      if (key === 'OPEN_AI_MODEL') return 'test-model';

      return undefined;
    });

    service = new ThreadManagerService(mockLoggerService, mockConfigService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).client = mockClient;
  });

  describe(ThreadManagerService.prototype.getOrCreateThread.name, () => {
    it('should return the ID of an existing thread if threadId is provided and found', async () => {
      (mockClient.beta.threads.retrieve as jest.Mock).mockResolvedValue({ id: existingThreadId });

      const result = await service.getOrCreateThread(existingThreadId);

      expect(mockClient.beta.threads.retrieve).toHaveBeenCalledWith(existingThreadId);
      expect(result).toEqual(existingThreadId);
    });

    it('should create a new thread if threadId is not provided', async () => {
      (mockClient.beta.threads.create as jest.Mock).mockResolvedValue({ id: newThreadId });

      const result = await service.getOrCreateThread();

      expect(mockClient.beta.threads.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(newThreadId);
    });

    it('should create a new thread if retrieving the existing thread fails', async () => {
      (mockClient.beta.threads.retrieve as jest.Mock).mockRejectedValue(new Error('Thread not found'));
      (mockClient.beta.threads.create as jest.Mock).mockResolvedValue({ id: newThreadId });

      const result = await service.getOrCreateThread(existingThreadId);

      expect(mockClient.beta.threads.retrieve).toHaveBeenCalledWith(existingThreadId);
      expect(mockClient.beta.threads.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(newThreadId);
    });
  });

  describe(ThreadManagerService.prototype.addMessageToThread.name, () => {
    it('should add a message to the thread and return the message ID', async () => {
      const message: MessageCreateParams = {
        content: 'Hello, assistant!',
        role: 'user',
      };

      (mockClient.beta.threads.messages.create as jest.Mock).mockResolvedValue({ id: messageId });

      const result = await service.addMessageToThread(existingThreadId, message);

      expect(mockClient.beta.threads.messages.create).toHaveBeenCalledWith(existingThreadId, message);
      expect(result).toEqual(messageId);
    });
  });
});
