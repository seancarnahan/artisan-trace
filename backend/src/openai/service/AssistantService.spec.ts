import { StructuredLoggerServiceFactory } from '@endpoint/nestjs-core-module';
import { ConfigService } from '@nestjs/config';
import { Assistant } from 'openai/resources/beta/assistants';
import OpenAI from 'openai';

import { AssistantService } from './AssistantService';
import { CustomAssistant } from '../domain/model/CustomAssistant';

jest.mock('openai');

describe(AssistantService.name, () => {
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>;

  const mockLoggerService = StructuredLoggerServiceFactory.noOpStructuredLoggerService();

  const mockClient = {
    beta: {
      assistants: {
        list: jest.fn(),
        create: jest.fn(),
      },
    },
  } as unknown as jest.Mocked<OpenAI>;

  let service: AssistantService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockImplementation((key) => {
      if (key === 'OPEN_AI_API_KEY') return 'test-api-key';
      if (key === 'OPEN_AI_PROJECT') return 'test-project';
      if (key === 'OPEN_AI_ORGANIZATION') return 'test-organization';
      if (key === 'OPEN_AI_MODEL') return 'test-model';

      return undefined;
    });

    service = new AssistantService(mockLoggerService, mockConfigService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).client = mockClient;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).model = 'test-model';
  });

  describe(AssistantService.prototype.createOrGetAssistant.name, () => {
    const mockAssistant: CustomAssistant = {
      name: 'Test Assistant',
      description: 'A test assistant',
      instructions: 'These are the instructions.',
      tools: [],
      toolResources: {},
    };

    it('should return an existing assistant if found', async () => {
      const existingAssistant = { name: 'Test Assistant' } as Assistant;

      (mockClient.beta.assistants.list as jest.Mock).mockResolvedValue({
        data: [existingAssistant],
      });

      const result = await service.createOrGetAssistant(mockAssistant);

      expect(mockClient.beta.assistants.list).toHaveBeenCalledWith({
        limit: 100,
        order: 'desc',
      });

      expect(result).toEqual(existingAssistant);
    });

    it('should create a new assistant if no existing assistant is found', async () => {
      const createdAssistant = { name: 'Test Assistant' } as Assistant;

      (mockClient.beta.assistants.list as jest.Mock).mockResolvedValue({
        data: [],
      });

      (mockClient.beta.assistants.create as jest.Mock).mockResolvedValue(createdAssistant);

      const result = await service.createOrGetAssistant(mockAssistant);

      expect(mockClient.beta.assistants.list).toHaveBeenCalledWith({
        limit: 100,
        order: 'desc',
      });

      expect(mockClient.beta.assistants.create).toHaveBeenCalledWith({
        model: 'test-model',
        name: mockAssistant.name,
        description: mockAssistant.description,
        instructions: mockAssistant.instructions,
        tools: mockAssistant.tools,
        tool_resources: mockAssistant.toolResources,
        response_format: mockAssistant.responseFormat,
      });

      expect(result).toEqual(createdAssistant);
    });

    it('should throw an error if fetching existing assistants fails', async () => {
      const mockError = new Error('Failed to fetch assistants');

      (mockClient.beta.assistants.list as jest.Mock).mockRejectedValue(mockError);

      await expect(service.createOrGetAssistant(mockAssistant)).rejects.toThrow(mockError);

      expect(mockClient.beta.assistants.list).toHaveBeenCalledWith({
        limit: 100,
        order: 'desc',
      });
    });
  });
});
