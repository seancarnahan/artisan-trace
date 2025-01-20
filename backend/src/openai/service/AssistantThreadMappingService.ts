import { Injectable } from '@nestjs/common';

import { ThreadMapping } from '../domain/model/ThreadMapping';
import { CreateThreadMappingDto } from '../domain/dto/CreateThreadMappingDto';
import { ThreadMappingPort } from '../domain/ports/ThreadMappingPort';

@Injectable()
export class AssistantThreadMappingService {
  constructor(private readonly threadMappingRepo: ThreadMappingPort) {}

  async findByAssistantThreadId(assistantThreadId: string): Promise<ThreadMapping | null> {
    return this.threadMappingRepo.findByAssistantThreadId(assistantThreadId);
  }

  async findBySlackThreadId(slackThreadId: string): Promise<ThreadMapping | null> {
    return this.threadMappingRepo.findBySlackThreadId(slackThreadId);
  }

  async saveMapping(createDto: CreateThreadMappingDto): Promise<ThreadMapping> {
    return this.threadMappingRepo.save(createDto);
  }
}
