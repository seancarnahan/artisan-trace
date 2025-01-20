import { Config } from './Config';
import { configValuesValidationSchema } from './configValidationSchema';

type Inputs = { [index in Config]: string | undefined };

describe('configValuesValidationSchema', () => {
  let inputs: Inputs;

  function buildValidInputs(): Inputs {
    return {
      [Config.AWS_REGION]: 'us-west-2',
      [Config.AWS_ACCESS_KEY_ID]: 'aws-key',
      [Config.AWS_SECRET_ACCESS_KEY]: 'aws-secret',
      [Config.DEPLOY_ENV]: 'development',
      [Config.PORT]: '3000',
      [Config.SERVICE_ACCOUNT_USER]: 'service-user',
      [Config.SERVICE_ACCOUNT_PASS]: 'service-pass',
      [Config.LD_SHARED_SERVICES_KEY]: 'shared-key',
      [Config.TOKEN_EXCHANGE_SERVICE_URL]: 'token-exchange-url',
      [Config.TRANSACTION_SERVICE_URL]: 'transaction-service-url',
      [Config.OPEN_AI_API_KEY]: 'open-ai-key',
      [Config.OPEN_AI_PROJECT]: 'open-ai-project',
      [Config.OPEN_AI_ORGANIZATION]: 'open-ai-organization',
      [Config.OPEN_AI_MODEL]: 'open-ai-model',
      [Config.SLACK_BOT_TOKEN]: 'slack-bot-token',
      [Config.SLACK_SIGNING_SECRET]: 'slack-signing-secret',
      [Config.SLACK_APP_TOKEN]: 'slack-app-token',
      [Config.WEB_SOCKET_URL]: 'web-socket-url',
      [Config.DB_HOST]: 'db-host',
      [Config.DB_PORT]: '5432',
      [Config.DB_APP_USER]: 'db-user',
      [Config.DB_APP_PASSWORD]: 'db-pass',
      [Config.POSTGRES_DATABASE]: 'postgres-db',
      [Config.DB_MIGRATION_USER]: 'db-migration-user',
      [Config.DB_MIGRATION_PASSWORD]: 'db-migration-pass',
      [Config.DB_LOGGING]: 'true',
    };
  }

  async function buildErrorMessage(providedInputs: Partial<Inputs>): Promise<string | undefined> {
    let actualError: Error | undefined;

    try {
      await configValuesValidationSchema.validateAsync(providedInputs, { abortEarly: false });
    } catch (error) {
      actualError = error as Error | undefined;
    }

    return actualError?.message;
  }

  beforeEach(() => {
    inputs = buildValidInputs();
  });

  it('validates all required values when no values are provided', async () => {
    const errorMessage = await buildErrorMessage({});

    expect(errorMessage).toContain('"AWS_REGION" is required');
    expect(errorMessage).toContain('"DEPLOY_ENV" is required');
    expect(errorMessage).toContain('"SERVICE_ACCOUNT_USER" is required');
    expect(errorMessage).toContain('"SERVICE_ACCOUNT_PASS" is required');
    expect(errorMessage).toContain('"TOKEN_EXCHANGE_SERVICE_URL" is required');
    expect(errorMessage).toContain('"TRANSACTION_SERVICE_URL" is required');
    expect(errorMessage).toContain('"OPEN_AI_API_KEY" is required');
    expect(errorMessage).toContain('"OPEN_AI_PROJECT" is required');
    expect(errorMessage).toContain('"OPEN_AI_ORGANIZATION" is required');
    expect(errorMessage).toContain('"OPEN_AI_MODEL" is required');
    expect(errorMessage).toContain('"SLACK_BOT_TOKEN" is required');
    expect(errorMessage).toContain('"SLACK_SIGNING_SECRET" is required');
    expect(errorMessage).toContain('"SLACK_APP_TOKEN" is required');
    expect(errorMessage).toContain('"WEB_SOCKET_URL" is required');
    expect(errorMessage).toContain('"DB_HOST" is required');
    expect(errorMessage).toContain('"DB_PORT" is required');
    expect(errorMessage).toContain('"DB_APP_USER" is required');
    expect(errorMessage).toContain('"DB_APP_PASSWORD" is required');
    expect(errorMessage).toContain('"POSTGRES_DATABASE" is required');
    expect(errorMessage).toContain('"DB_MIGRATION_USER" is required');
    expect(errorMessage).toContain('"DB_MIGRATION_PASSWORD" is required');
    expect(errorMessage).toContain('"DB_LOGGING" is required');
  });

  it('successfully validates the schema with valid inputs', async () => {
    expect(await configValuesValidationSchema.validateAsync(inputs)).toBeDefined();
  });
});
