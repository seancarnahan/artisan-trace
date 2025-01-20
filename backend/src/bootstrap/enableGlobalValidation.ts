/* istanbul ignore file */
import { DynamicModule, INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

export function enableGlobalValidation<T>(app: INestApplication, module?: DynamicModule | Type<T>): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: true,
    }),
  );

  const container = module ? app.select(module) : app;

  useContainer(container, { fallbackOnErrors: true });
}
