// import { Injectable } from '@nestjs/common';
// import { EntityNotFoundError, Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

// import { ThreadMapping } from '../..//domain/model/ThreadMapping';
// import { ThreadMappingEntity } from '../entities/ThreadMappingEntity';
// import { CreateThreadMappingDto } from '../../domain/dto/CreateThreadMappingDto';
// import { ThreadMappingPort } from '../../domain/ports/ThreadMappingPort';

// @Injectable()
// export class ThreadMappingTypeormRepository implements ThreadMappingPort {
//   constructor(
//     @InjectRepository(ThreadMappingEntity)
//     private readonly repo: Repository<ThreadMappingEntity>,
//   ) {}

//   async findBySlackThreadId(slackThreadId: string): Promise<ThreadMapping | null> {
//     const entity = await this.repo.findOneBy({
//       slackThreadId,
//       // deletedAt: IsNull(), TODO - fix this
//     });

//     if (entity === null) {
//       // TODO - log error

//       return null;
//     }

//     return ThreadMappingEntity.toDomainModel(entity);
//   }

//   async findByAssistantThreadId(assistantThreadId: string): Promise<ThreadMapping | null> {
//     const entity = await this.repo.findOneBy({
//       assistantThreadId,
//       // deletedAt: IsNull(), TODO - fix this
//     });

//     if (entity === null) {
//       // TODO - log error
//       throw new EntityNotFoundError(ThreadMappingEntity.name, assistantThreadId);
//     }

//     return ThreadMappingEntity.toDomainModel(entity);
//   }

//   async save(createDto: CreateThreadMappingDto): Promise<ThreadMapping> {
//     const threadMappingEntity = ThreadMappingEntity.fromCreateDto(createDto);

//     try {
//       await this.repo.save(threadMappingEntity);

//       return ThreadMappingEntity.toDomainModel(threadMappingEntity);
//     } catch (error) {
//       // TODO - log error

//       throw error;
//     }
//   }
// }
