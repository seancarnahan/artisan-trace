import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';

import { ToolCallbackService } from './ToolCallbackService';

const threadId = 'thread-id';
const runId = 'run-id';

describe(ToolCallbackService.name, () => {
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>;


  const mockClient = {
    beta: {
      threads: {
        runs: {
          submitToolOutputs: jest.fn(),
        },
      },
    },
  } as unknown as jest.Mocked<OpenAI>;

  let service: ToolCallbackService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockImplementation((key) => {
      if (key === 'OPEN_AI_API_KEY') return 'test-api-key';
      if (key === 'OPEN_AI_PROJECT') return 'test-project';
      if (key === 'OPEN_AI_ORGANIZATION') return 'test-organization';
      if (key === 'OPEN_AI_MODEL') return 'test-model';

      return undefined;
    });

    service = new ToolCallbackService(mockConfigService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).client = mockClient;
  });

  describe(ToolCallbackService.prototype.handleRequiredAction.name, () => {
    const run: Run = {
      required_action: {
        submit_tool_outputs: {
          tool_calls: [
            {
              id: 'tool-call-id',
              input: 'tool-input',
            },
          ],
        },
      },
    } as unknown as Run;

    it('should call the provided toolCallback and submit tool outputs', async () => {
      const toolCallback = jest.fn().mockResolvedValue({ success: true });

      await service.handleRequiredAction(run, threadId, runId, toolCallback);

      expect(toolCallback).toHaveBeenCalledWith(run.required_action?.submit_tool_outputs.tool_calls[0]);
      expect(mockClient.beta.threads.runs.submitToolOutputs).toHaveBeenCalledWith(threadId, runId, {
        tool_outputs: [
          {
            output: JSON.stringify({ success: true }),
            tool_call_id: 'tool-call-id',
          },
        ],
      });
    });

    it('should handle cases where no toolCallback is provided', async () => {
      await service.handleRequiredAction(run, threadId, runId);

      expect(mockClient.beta.threads.runs.submitToolOutputs).toHaveBeenCalledWith(threadId, runId, {
        tool_outputs: [
          {
            output: JSON.stringify({ message: 'No callback provided' }),
            tool_call_id: 'tool-call-id',
          },
        ],
      });
    });

    it('should throw an error if tool call input is undefined', async () => {
      const invalidRun: Run = {
        required_action: {
          submit_tool_outputs: {
            tool_calls: [],
          },
        },
      } as unknown as Run;

      await expect(service.handleRequiredAction(invalidRun, threadId, runId)).rejects.toThrow(
        'Tool call input is undefined',
      );

      expect(mockClient.beta.threads.runs.submitToolOutputs).not.toHaveBeenCalled();
    });

    it('should throw an error if the toolCallback throws an error', async () => {
      const toolCallback = jest.fn().mockRejectedValue(new Error('Callback error'));

      await expect(service.handleRequiredAction(run, threadId, runId, toolCallback)).rejects.toThrow('Callback error');

      expect(toolCallback).toHaveBeenCalledWith(run.required_action?.submit_tool_outputs.tool_calls[0]);
      expect(mockClient.beta.threads.runs.submitToolOutputs).not.toHaveBeenCalled();
    });
  });
});
