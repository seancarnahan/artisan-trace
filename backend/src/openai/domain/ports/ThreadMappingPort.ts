import { CreateThreadMappingDto } from '../dto/CreateThreadMappingDto';
import { ThreadMapping } from '../model/ThreadMapping';

export abstract class ThreadMappingPort {
  abstract findBySlackThreadId(slackThreadId: string): Promise<ThreadMapping | null>;
  abstract findByAssistantThreadId(assistantThreadId: string): Promise<ThreadMapping | null>;
  abstract save(createDto: CreateThreadMappingDto): Promise<ThreadMapping>;
}
