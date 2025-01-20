import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { AssistantService } from './service/AssistantService';
import { AudioService } from './service/AudioService';
import { FileService } from './service/FileService';
// import { AssistantThreadMappingService } from './service/AssistantThreadMappingService';
// import { ThreadMappingPort } from './domain/ports/ThreadMappingPort';
// import { ThreadMappingTypeormRepository } from './repository/typeorm/ThreadMappingTypeormRepository';
// import { ThreadMappingEntity } from './repository/entities/ThreadMappingEntity';
import { RunManagerService } from './service/RunManagerService';
import { ThreadManagerService } from './service/ThreadManagerService';
import { ToolCallbackService } from './service/ToolCallbackService';

@Module({
  imports: [
    ConfigModule,
    // TypeOrmModule.forFeature([ThreadMappingEntity])
  ],
  controllers: [],
  providers: [
    AssistantService,
    AudioService,
    FileService,
    // AssistantThreadMappingService,
    // { provide: ThreadMappingPort, useClass: ThreadMappingTypeormRepository },
    // ThreadMappingTypeormRepository,
    RunManagerService,
    ThreadManagerService,
    ToolCallbackService,
  ],
  exports: [
    AssistantService,
    AudioService,
    FileService,
    ThreadManagerService,
    RunManagerService,
    // AssistantThreadMappingService,
  ],
})
export class OpenAIModule {}
