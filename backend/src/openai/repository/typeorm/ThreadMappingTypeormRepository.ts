import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { STRUCTURED_LOGGER_SERVICE, StructuredLoggerService } from '@endpoint/nestjs-core-module';

import { ThreadMapping } from '@app/openai/domain/model/ThreadMapping';
import { ThreadMappingEntity } from '../entities/ThreadMappingEntity';
import { CreateThreadMappingDto } from '@app/openai/domain/dto/CreateThreadMappingDto';
import { EntityNotFound } from '@app/database/exceptions/EntityNotFound';
import { ThreadMappingPort } from '@app/openai/domain/ports/ThreadMappingPort';

@Injectable()
export class ThreadMappingTypeormRepository implements ThreadMappingPort {
  constructor(
    @InjectRepository(ThreadMappingEntity)
    private readonly repo: Repository<ThreadMappingEntity>,
    @Inject(STRUCTURED_LOGGER_SERVICE)
    private readonly loggerService: StructuredLoggerService<{}>,
  ) {}

  async findBySlackThreadId(slackThreadId: string): Promise<ThreadMapping | null> {
    const entity = await this.repo.findOneBy({
      slackThreadId,
      deletedAt: IsNull(),
    });

    if (entity === null) {
      this.loggerService.log({
        message: 'Slack Thread Mapping Not Found',
        slackThreadId,
      });

      return null;
    }

    return ThreadMappingEntity.toDomainModel(entity);
  }

  async findByAssistantThreadId(assistantThreadId: string): Promise<ThreadMapping | null> {
    const entity = await this.repo.findOneBy({
      assistantThreadId,
      deletedAt: IsNull(),
    });

    if (entity === null) {
      this.loggerService.error({
        message: 'Assistant Thread Mapping Not Found',
        assistantThreadId,
      });
      throw new EntityNotFound(ThreadMappingEntity.name, assistantThreadId, 'assistantThreadId');
    }

    return ThreadMappingEntity.toDomainModel(entity);
  }

  async save(createDto: CreateThreadMappingDto): Promise<ThreadMapping> {
    const threadMappingEntity = ThreadMappingEntity.fromCreateDto(createDto);

    try {
      await this.repo.save(threadMappingEntity);

      return ThreadMappingEntity.toDomainModel(threadMappingEntity);
    } catch (error) {
      this.loggerService.error({
        message: 'Error on create',
        error,
        createDto,
      });

      throw error;
    }
  }
}
