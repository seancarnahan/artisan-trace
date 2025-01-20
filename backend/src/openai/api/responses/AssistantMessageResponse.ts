import { Expose } from 'class-transformer';

export class AssistantMessageResponse {
  @Expose()
  message!: string;

  @Expose()
  threadId!: string;
}
