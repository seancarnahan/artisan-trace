import { Column, Entity, Index } from 'typeorm';
import { Expose, instanceToPlain, plainToInstance } from 'class-transformer';

import { ThreadMapping } from '@app/openai/domain/model/ThreadMapping';
import { CreateThreadMappingDto } from '@app/openai/domain/dto/CreateThreadMappingDto';
import { ThreadMappingType } from '@app/openai/domain/model/ThreadMappingType';

@Entity('thread_mappings')
export class ThreadMappingEntity {
  @Expose()
  @Column({ type: 'varchar', nullable: false })
  @Index('IDX_slack_thread_id', { unique: true })
  slackThreadId!: string; // TODO - change this to mappedThreadId

  @Expose()
  @Column({ type: 'varchar', nullable: false })
  @Index('IDX_assistant_thread_id', { unique: true })
  assistantThreadId!: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: ThreadMappingType,
    nullable: false,
  })
  type!: ThreadMappingType;

  // TODO - add base entity

  public static toDomainModel(entity: ThreadMappingEntity): ThreadMapping {
    return plainToInstance(ThreadMapping, instanceToPlain(entity), { excludeExtraneousValues: true });
  }

  public static fromCreateDto(dto: CreateThreadMappingDto): ThreadMappingEntity {
    return plainToInstance(ThreadMappingEntity, instanceToPlain(dto), { excludeExtraneousValues: true });
  }
}
