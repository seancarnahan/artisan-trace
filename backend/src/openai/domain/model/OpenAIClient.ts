import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

import { Config } from '@app/core/config/Config';

export class OpenAIClient {
  protected client: OpenAI;
  protected readonly model: string;

  constructor(private readonly config: ConfigService) {
    const OPEN_AI_API_KEY = this.config.getOrThrow(Config.OPEN_AI_API_KEY);
    const PROJECT = this.config.getOrThrow(Config.OPEN_AI_PROJECT);
    const ORGANIZATION = this.config.getOrThrow(Config.OPEN_AI_ORGANIZATION);
    const model = this.config.getOrThrow(Config.OPEN_AI_MODEL);

    this.model = model;

    this.client = new OpenAI({
      apiKey: OPEN_AI_API_KEY,
      project: PROJECT,
      organization: ORGANIZATION,
    });
  }
}
