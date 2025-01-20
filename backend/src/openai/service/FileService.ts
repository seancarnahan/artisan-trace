import fs from 'fs';
import { STRUCTURED_LOGGER_SERVICE, StructuredLoggerService } from '@endpoint/nestjs-core-module';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenAIClient } from '../domain/model/OpenAIClient';

@Injectable()
export class FileService extends OpenAIClient {
  constructor(
    @Inject(STRUCTURED_LOGGER_SERVICE) private readonly loggerService: StructuredLoggerService<{}>,
    protected readonly configService: ConfigService,
  ) {
    super(configService);
  }

  async uploadOrGetFile(path: string): Promise<string> {
    if (!fs.existsSync(path)) {
      this.loggerService.error({
        message: 'File not found at local path',
        path,
      });
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
      this.loggerService.error({
        message: 'Error creating file',
      });
      throw Error('Error creating file');
    }

    return createdFile.id;
  }
}
