import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenAIClient } from '../domain/model/OpenAIClient';

@Injectable()
export class AudioService extends OpenAIClient {
  constructor(
    protected readonly configService: ConfigService,
  ) {
    super(configService);
  }

  async speechToText(path: string): Promise<string> {
    try {
      const fileStream = fs.createReadStream(path);

      const transcription = await this.client.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
      });

      return transcription.text;
    } catch (error) {
      // TODO - log error

      throw error;
    }
  }
}
