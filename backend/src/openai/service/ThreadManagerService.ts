import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageCreateParams } from 'openai/resources/beta/threads/messages';

import { OpenAIClient } from '../domain/model/OpenAIClient';

@Injectable()
export class ThreadManagerService extends OpenAIClient {
  constructor(
    @Inject(STRUCTURED_LOGGER_SERVICE) private readonly loggerService: StructuredLoggerService<{}>,
    protected readonly configService: ConfigService,
  ) {
    super(configService);
  }

  async getOrCreateThread(threadId?: string): Promise<string> {
    if (threadId) {
      try {
        const existingThread = await this.client.beta.threads.retrieve(threadId);

        return existingThread.id;
      } catch (error) {
        this.loggerService.error({ message: 'Error retrieving thread, creating a new one', error });
      }
    }

    const newEmptyThread = await this.client.beta.threads.create();

    return newEmptyThread.id;
  }

  async addMessageToThread(threadId: string, message: MessageCreateParams): Promise<string> {
    return (await this.client.beta.threads.messages.create(threadId, message)).id;
  }
}
