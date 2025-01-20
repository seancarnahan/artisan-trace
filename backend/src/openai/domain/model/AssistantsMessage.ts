// istanbul ignore file

import { Expose } from 'class-transformer';

export class AssistantsMessage {
  @Expose()
  message!: string;

  @Expose()
  threadId!: string;
}
