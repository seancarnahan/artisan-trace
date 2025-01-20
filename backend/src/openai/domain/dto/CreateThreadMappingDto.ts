// istanbul ignore file

import { Expose } from 'class-transformer';

export class CreateThreadMappingDto {
  @Expose()
  slackThreadId!: string;

  @Expose()
  assistantThreadId!: string;

  @Expose()
  type!: string;

  @Expose()
  createdBy!: string;
}
