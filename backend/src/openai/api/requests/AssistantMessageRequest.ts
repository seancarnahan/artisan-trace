import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssistantMessageRequest {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  message!: string;
}
