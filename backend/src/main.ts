import { NestFactory } from '@nestjs/core';
import { bootstrapCallback } from './bootstrap/bootstrapCallback';
import { AppModule } from './AppModule';

async function bootstrap() {
  // Create the application instance
  const app = await NestFactory.create(AppModule);

  // Use the bootstrap callback for further setup
  await bootstrapCallback(app);

  // Start the application
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Application is running on: http://localhost:${PORT}`);
}

bootstrap();
