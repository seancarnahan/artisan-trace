import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai/OpenAIModule';

@Module({
  imports: [
    OpenAIModule,
  ],
})
export class AppModule {}
