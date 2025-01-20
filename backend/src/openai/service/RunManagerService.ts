import { STRUCTURED_LOGGER_SERVICE, StructuredLoggerService } from '@endpoint/nestjs-core-module';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Run } from 'openai/resources/beta/threads/runs/runs';

import { OpenAIClient } from '../domain/model/OpenAIClient';
import { ToolCallbackService } from './ToolCallbackService';
import { FunctionToolCall } from '../domain/model/FunctionToolCall';

@Injectable()
export class RunManagerService extends OpenAIClient {
  constructor(
    @Inject(STRUCTURED_LOGGER_SERVICE) private readonly loggerService: StructuredLoggerService<{}>,
    protected readonly configService: ConfigService,
    private readonly toolCallbackService: ToolCallbackService,
  ) {
    super(configService);
  }

  async executeRun(
    threadId: string,
    assistantId: string,
    toolCallback?: (functionToolCall: FunctionToolCall) => Promise<unknown>,
  ): Promise<string> {
    const createdRun = await this.client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      stream: false,
    });
    const runId = createdRun.id;

    await this.pollRun(threadId, runId, toolCallback);

    return this.getMostRecentMessage(threadId, runId);
  }

  protected async pollRun(
    threadId: string,
    runId: string,
    toolCallback?: (functionToolCall: FunctionToolCall) => Promise<unknown>,
  ): Promise<void> {
    const poll = async (): Promise<void> => {
      const run: Run = await this.client.beta.threads.runs.poll(threadId, runId, { pollIntervalMs: 1000 });

      if (this.isTerminalRunState(run.status)) {
        this.handleTerminalRunState(run.status);
      }

      if (run.status === 'requires_action') {
        await this.toolCallbackService.handleRequiredAction(run, threadId, runId, toolCallback);
      }

      if (run.status === 'completed') return;

      await poll(); // Recurse until the run is completed or terminal
    };

    return poll();
  }

  protected isTerminalRunState(status: string): boolean {
    return ['failed', 'expired', 'cancelled'].includes(status);
  }

  protected handleTerminalRunState(status: string): void {
    const errorMessages: Record<string, string> = {
      failed: 'Run failed',
      expired: 'Run expired',
      cancelled: 'Run cancelled',
    };

    const message = errorMessages[status] || `Unrecognized run state: ${status}`;

    this.loggerService.error({ message, status });

    throw new Error(message);
  }

  protected async getMostRecentMessage(threadId: string, runId: string): Promise<string> {
    const messages = (await this.client.beta.threads.messages.list(threadId)).data.filter(
      (message) => message.run_id === runId,
    );

    if (!messages.length) return 'No messages found';
    const firstContent = messages[0].content[0];

    return 'text' in firstContent ? firstContent.text?.value ?? '' : 'No text content found';
  }
}
