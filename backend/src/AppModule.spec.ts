import { Test } from '@nestjs/testing';

import { AppModule } from './AppModule';
import { bootstrapCallback } from './bootstrap/bootstrapCallback';
import { Config } from './config/Config';

process.env[Config.DEPLOY_ENV] = 'test';

describe(AppModule, () => {
  const originalProcessEnv = { ...process.env };

  it(`builds the ${AppModule.name} without errors`, async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createNestApplication();

    expect(app).toBeDefined();

    await app.init();

    await bootstrapCallback(app);

    await app.close();
  });

  afterAll(() => {
    process.env = originalProcessEnv;
  });
});
