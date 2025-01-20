import { Assistant } from 'openai/resources/beta/assistants';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenAIClient } from '../domain/model/OpenAIClient';
import { CustomAssistant } from '../domain/model/CustomAssistant';

@Injectable()
export class AssistantService extends OpenAIClient {
  constructor(
    @Inject(STRUCTURED_LOGGER_SERVICE) private readonly loggerService: StructuredLoggerService<{}>,
    protected readonly configService: ConfigService,
  ) {
    super(configService);
  }

  async createOrGetAssistant(assistant: CustomAssistant): Promise<Assistant> {
    try {
      const assistants = await this.client.beta.assistants.list({
        limit: 100,
        order: 'desc',
      });

      const existingAssistant = assistants.data.find((foundAssistant) => foundAssistant.name === assistant.name);

      if (existingAssistant !== undefined) {
        return existingAssistant;
      }
    } catch (error) {
      this.loggerService.error({
        message: 'Error fetching existing assistants',
        error,
      });

      throw error;
    }

    return this.client.beta.assistants.create({
      model: this.model,
      name: assistant.name,
      description: assistant.description,
      instructions: assistant.instructions,
      tools: assistant.tools,
      tool_resources: assistant.toolResources,
      response_format: assistant.responseFormat,
    });
  }
}
