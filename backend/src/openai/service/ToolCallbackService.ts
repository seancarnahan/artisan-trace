import { STRUCTURED_LOGGER_SERVICE, StructuredLoggerService } from '@endpoint/nestjs-core-module';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Run } from 'openai/resources/beta/threads/runs/runs';

import { OpenAIClient } from '../domain/model/OpenAIClient';
import { FunctionToolCall } from '../domain/model/FunctionToolCall';

@Injectable()
export class ToolCallbackService extends OpenAIClient {
  constructor(
    @Inject(STRUCTURED_LOGGER_SERVICE) private readonly loggerService: StructuredLoggerService<{}>,
    protected readonly configService: ConfigService,
  ) {
    super(configService);
  }

  async handleRequiredAction(
    run: Run,
    threadId: string,
    runId: string,
    toolCallback?: (functionToolCall: FunctionToolCall) => Promise<unknown>,
  ): Promise<void> {
    const toolCallInput = run.required_action?.submit_tool_outputs.tool_calls[0];

    if (!toolCallInput) throw new Error('Tool call input is undefined');

    try {
      const toolResponse = toolCallback
        ? await toolCallback(toolCallInput as FunctionToolCall)
        : { message: 'No callback provided' };

      this.loggerService.log({ message: 'Submitting tool outputs', toolResponse });
      await this.client.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: [
          {
            output: JSON.stringify(toolResponse),
            tool_call_id: toolCallInput.id,
          },
        ],
      });
    } catch (error) {
      this.loggerService.error({ message: 'Error in tool callback', error });
      throw error;
    }
  }
}
