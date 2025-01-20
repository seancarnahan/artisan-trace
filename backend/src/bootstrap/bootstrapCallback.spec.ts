import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { mocked } from 'jest-mock';
import { ConfigModule } from '@nestjs/config';

import { AppModule } from '../AppModule';
import { enableGlobalValidation } from './enableGlobalValidation';
import { setUpOpenApi } from './setUpOpenApi';
import { bootstrapCallback } from './bootstrapCallback';
import { Config } from '@app/config/Config';

jest.mock('./enableGlobalValidation');
jest.mock('./setUpOpenApi');

describe(bootstrapCallback, () => {
  let app: INestApplication | undefined;
  const setUpOpenApiMock = mocked(setUpOpenApi);
  const enableGlobalValidationMock = mocked(enableGlobalValidation);

  async function buildApp(): Promise<INestApplication> {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    return app;
  }

  describe('when not in production', () => {
    beforeAll(async () => {
      jest.clearAllMocks();

      if (!app) {
        app = await buildApp();
      }

      process.env[Config.DEPLOY_ENV] = 'test';

      await bootstrapCallback(app);
    });

    it('enables global validation', () => {
      expect(enableGlobalValidationMock).toHaveBeenCalledTimes(1);
      expect(enableGlobalValidationMock).toHaveBeenCalledWith(app, AppModule);
    });

    it('sets up open api', () => {
      expect(setUpOpenApiMock).toHaveBeenCalledTimes(1);
      expect(setUpOpenApiMock).toHaveBeenCalledWith(app);
    });
  });

  describe('when in production', () => {
    beforeAll(async () => {
      jest.clearAllMocks();

      if (!app) {
        app = await buildApp();
      }

      process.env[Config.DEPLOY_ENV] = 'production';

      await bootstrapCallback(app);
    });

    it('enables global validation', () => {
      expect(enableGlobalValidationMock).toHaveBeenCalledTimes(1);
      expect(enableGlobalValidationMock).toHaveBeenCalledWith(app, AppModule);
    });

    it('does not set up open api', () => {
      expect(setUpOpenApiMock).not.toHaveBeenCalled();
    });
  });
});
