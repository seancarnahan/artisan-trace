import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenAIClient } from '../domain/model/OpenAIClient';

@Injectable()
export class FileService extends OpenAIClient {
  constructor(
    protected readonly configService: ConfigService,
  ) {
    super(configService);
  }

  async uploadOrGetFile(path: string): Promise<string> {
    if (!fs.existsSync(path)) {
      // TODO - log error
      throw Error('File not found at local path');
    }

    const files = await this.client.files.list();
    const fileName = path.split('/').pop();
    const existingFile = files.data.find((foundFile) => foundFile.filename === fileName);

    if (existingFile?.id !== undefined) {
      return existingFile.id;
    }

    const createdFile = await this.client.files.create({
      file: fs.createReadStream(path),
      purpose: 'assistants',
    });

    if (createdFile.id === undefined) {
      // TODO - log error
      throw Error('Error creating file');
    }

    return createdFile.id;
  }
}
