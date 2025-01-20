import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageCreateParams } from 'openai/resources/beta/threads/messages';

import { OpenAIClient } from '../domain/model/OpenAIClient';

@Injectable()
export class ThreadManagerService extends OpenAIClient {
  constructor(
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
        // TODO - log error
      }
    }

    const newEmptyThread = await this.client.beta.threads.create();

    return newEmptyThread.id;
  }

  async addMessageToThread(threadId: string, message: MessageCreateParams): Promise<string> {
    return (await this.client.beta.threads.messages.create(threadId, message)).id;
  }
}
