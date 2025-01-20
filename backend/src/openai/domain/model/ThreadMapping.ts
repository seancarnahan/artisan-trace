import { Expose } from 'class-transformer';

export class ThreadMapping {
  @Expose()
  slackThreadId!: string;

  @Expose()
  assistantThreadId!: string;

  @Expose()
  type!: string;
}
