
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';

import { ToolCallbackService } from './ToolCallbackService';
import { FunctionToolCall } from '../domain/model/FunctionToolCall';
import { RunManagerService } from './RunManagerService';

const existingThreadId = 'thread-id';
const assistantId = 'assistant-id';
const existingRunId = 'run-id';

class TestableRunManagerService extends RunManagerService {
  public override async pollRun(
    threadId: string,
    runId: string,
    toolCallback?: (functionToolCall: FunctionToolCall) => Promise<unknown>,
  ): Promise<void> {
    return super.pollRun(threadId, runId, toolCallback);
  }

  public override isTerminalRunState(status: string): boolean {
    return super.isTerminalRunState(status);
  }

  public override handleTerminalRunState(status: string): void {
    super.handleTerminalRunState(status);
  }

  public override async getMostRecentMessage(threadId: string, runId: string): Promise<string> {
    return super.getMostRecentMessage(threadId, runId);
  }
}

describe(RunManagerService.name, () => {
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>;

  const mockToolCallbackService = {
    handleRequiredAction: jest.fn(),
  } as unknown as jest.Mocked<ToolCallbackService>;

  const mockClient = {
    beta: {
      threads: {
        runs: {
          create: jest.fn(),
          poll: jest.fn(),
        },
        messages: {
          list: jest.fn(),
        },
      },
    },
  } as unknown as jest.Mocked<OpenAI>;

  let service: TestableRunManagerService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockImplementation((key) => {
      if (key === 'OPEN_AI_API_KEY') return 'test-api-key';
      if (key === 'OPEN_AI_PROJECT') return 'test-project';
      if (key === 'OPEN_AI_ORGANIZATION') return 'test-organization';
      if (key === 'OPEN_AI_MODEL') return 'test-model';

      return undefined;
    });

    service = new TestableRunManagerService(mockConfigService, mockToolCallbackService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).client = mockClient;
  });

  describe(RunManagerService.prototype.executeRun.name, () => {
    it('should execute a run and return the most recent message', async () => {
      const mostRecentMessage = 'Latest message';

      (mockClient.beta.threads.runs.create as jest.Mock).mockResolvedValue({ id: existingRunId });
      jest.spyOn(service, 'pollRun').mockResolvedValue(undefined);
      jest.spyOn(service, 'getMostRecentMessage').mockResolvedValue(mostRecentMessage);

      const result = await service.executeRun(existingThreadId, assistantId);

      expect(mockClient.beta.threads.runs.create).toHaveBeenCalledWith(existingThreadId, {
        assistant_id: assistantId,
        stream: false,
      });

      expect(service.pollRun).toHaveBeenCalledWith(existingThreadId, existingRunId, undefined);
      expect(service.getMostRecentMessage).toHaveBeenCalledWith(existingThreadId, existingRunId);
      expect(result).toEqual(mostRecentMessage);
    });
  });

  describe(TestableRunManagerService.prototype.pollRun.name, () => {
    it('should handle completed run status without recursion', async () => {
      const run: Run = { id: existingRunId, status: 'completed' } as Run;

      (mockClient.beta.threads.runs.poll as jest.Mock).mockResolvedValue(run);

      await service.pollRun(existingThreadId, existingRunId);

      expect(mockClient.beta.threads.runs.poll).toHaveBeenCalledWith(existingThreadId, existingRunId, {
        pollIntervalMs: 1000,
      });

      expect(mockToolCallbackService.handleRequiredAction).not.toHaveBeenCalled();
    });

    it('should handle requires_action run status and call tool callback service', async () => {
      const runRequiresAction: Run = { id: existingRunId, status: 'requires_action' } as Run;
      const runCompleted: Run = { id: existingRunId, status: 'completed' } as Run;
      const toolCallback = jest.fn();

      (mockClient.beta.threads.runs.poll as jest.Mock)
        .mockResolvedValueOnce(runRequiresAction)
        .mockResolvedValueOnce(runCompleted);

      await service.pollRun(existingThreadId, existingRunId, toolCallback);

      expect(mockClient.beta.threads.runs.poll).toHaveBeenCalledTimes(2);
      expect(mockClient.beta.threads.runs.poll).toHaveBeenNthCalledWith(1, existingThreadId, existingRunId, {
        pollIntervalMs: 1000,
      });

      expect(mockClient.beta.threads.runs.poll).toHaveBeenNthCalledWith(2, existingThreadId, existingRunId, {
        pollIntervalMs: 1000,
      });

      expect(mockToolCallbackService.handleRequiredAction).toHaveBeenCalledWith(
        runRequiresAction,
        existingThreadId,
        existingRunId,
        toolCallback,
      );
    });

    it('should handle terminal run status and throw an error', async () => {
      const run: Run = { id: existingRunId, status: 'failed' } as Run;

      (mockClient.beta.threads.runs.poll as jest.Mock).mockResolvedValue(run);

      jest.spyOn(service, 'isTerminalRunState').mockReturnValue(true);
      jest.spyOn(service, 'handleTerminalRunState').mockImplementation(() => {
        throw new Error('Run failed');
      });

      await expect(service.pollRun(existingThreadId, existingRunId)).rejects.toThrow('Run failed');

      expect(mockClient.beta.threads.runs.poll).toHaveBeenCalledWith(existingThreadId, existingRunId, {
        pollIntervalMs: 1000,
      });

      expect(service.handleTerminalRunState).toHaveBeenCalledWith('failed');
    });
  });

  describe(TestableRunManagerService.prototype.isTerminalRunState.name, () => {
    it('should return true for terminal states', () => {
      expect(service.isTerminalRunState('failed')).toBe(true);
      expect(service.isTerminalRunState('expired')).toBe(true);
      expect(service.isTerminalRunState('cancelled')).toBe(true);
    });

    it('should return false for non-terminal states', () => {
      expect(service.isTerminalRunState('requires_action')).toBe(false);
      expect(service.isTerminalRunState('completed')).toBe(false);
      expect(service.isTerminalRunState('running')).toBe(false);
    });
  });

  describe(TestableRunManagerService.prototype.handleTerminalRunState.name, () => {
    it('should log and throw an error for "failed" state', () => {
      const errorMessage = 'Run failed';

      expect(() => service.handleTerminalRunState('failed')).toThrow(errorMessage);
    });

    it('should log and throw an error for "expired" state', () => {
      const errorMessage = 'Run expired';

      expect(() => service.handleTerminalRunState('expired')).toThrow(errorMessage);
    });

    it('should log and throw an error for "cancelled" state', () => {
      const errorMessage = 'Run cancelled';

      expect(() => service.handleTerminalRunState('cancelled')).toThrow(errorMessage);
    });

    it('should log and throw an error for unrecognized state', () => {
      const unrecognizedState = 'unknown_state';
      const errorMessage = `Unrecognized run state: ${unrecognizedState}`;

      expect(() => service.handleTerminalRunState(unrecognizedState)).toThrow(errorMessage);
    });
  });

  describe(TestableRunManagerService.prototype.getMostRecentMessage.name, () => {
    it('should return the most recent message content', async () => {
      const messages = [{ run_id: existingRunId, content: [{ text: { value: 'Latest message' } }] }];

      (mockClient.beta.threads.messages.list as jest.Mock).mockResolvedValue({ data: messages });

      const result = await service.getMostRecentMessage(existingThreadId, existingRunId);

      expect(mockClient.beta.threads.messages.list).toHaveBeenCalledWith(existingThreadId);
      expect(result).toEqual('Latest message');
    });

    it('should return a default message if no messages are found', async () => {
      (mockClient.beta.threads.messages.list as jest.Mock).mockResolvedValue({ data: [] });

      const result = await service.getMostRecentMessage(existingThreadId, existingRunId);

      expect(mockClient.beta.threads.messages.list).toHaveBeenCalledWith(existingThreadId);
      expect(result).toEqual('No messages found');
    });

    it('should return a default message if content does not have text', async () => {
      const messages = [{ run_id: existingRunId, content: [{}] }];

      (mockClient.beta.threads.messages.list as jest.Mock).mockResolvedValue({ data: messages });

      const result = await service.getMostRecentMessage(existingThreadId, existingRunId);

      expect(mockClient.beta.threads.messages.list).toHaveBeenCalledWith(existingThreadId);
      expect(result).toEqual('No text content found');
    });

    it('should return a default message if content does not have text value', async () => {
      const messages = [{ run_id: existingRunId, content: [{ text: {} }] }];

      (mockClient.beta.threads.messages.list as jest.Mock).mockResolvedValue({ data: messages });

      const result = await service.getMostRecentMessage(existingThreadId, existingRunId);

      expect(mockClient.beta.threads.messages.list).toHaveBeenCalledWith(existingThreadId);
      expect(result).toEqual('');
    });
  });
});
