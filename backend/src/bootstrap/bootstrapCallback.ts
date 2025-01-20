import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '../AppModule';
import { enableGlobalValidation } from './enableGlobalValidation';
import { setUpOpenApi } from './setUpOpenApi';
import { Config } from '@app/config/Config';
import { ConfigValues } from '@app/config/ConfigValues';

export async function bootstrapCallback(app: INestApplication): Promise<void> {
  const configService = app.get<ConfigService<ConfigValues, true>>(ConfigService);
  const isNotProduction = configService.get(Config.DEPLOY_ENV, { infer: true }) !== 'production';

  enableGlobalValidation(app, AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (isNotProduction) {
    setUpOpenApi(app);
  }
}
