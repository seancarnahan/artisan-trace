import Joi from 'joi';

import { Config } from './Config';

const configValuesDefinitions: { [index in Config]: Joi.StringSchema | Joi.NumberSchema } = {
  [Config.AWS_REGION]: Joi.string().required(),

  [Config.AWS_ACCESS_KEY_ID]: Joi.string(),
  [Config.AWS_SECRET_ACCESS_KEY]: Joi.string(),
  [Config.DEPLOY_ENV]: Joi.string()
    .valid('development', 'integration', 'staging', 'production', 'test', 'local', 'sandbox')
    .required(),
  [Config.PORT]: Joi.string().default('3000'),
  [Config.SERVICE_ACCOUNT_USER]: Joi.string().required(),
  [Config.SERVICE_ACCOUNT_PASS]: Joi.string().required(),
  [Config.LD_SHARED_SERVICES_KEY]: Joi.string(),
  [Config.TOKEN_EXCHANGE_SERVICE_URL]: Joi.string().required(),
  [Config.TRANSACTION_SERVICE_URL]: Joi.string().required(),
  [Config.OPEN_AI_API_KEY]: Joi.string().required(),
  [Config.OPEN_AI_PROJECT]: Joi.string().required(),
  [Config.OPEN_AI_ORGANIZATION]: Joi.string().required(),
  [Config.OPEN_AI_MODEL]: Joi.string().required(),
  [Config.SLACK_BOT_TOKEN]: Joi.string().required(),
  [Config.SLACK_SIGNING_SECRET]: Joi.string().required(),
  [Config.SLACK_APP_TOKEN]: Joi.string().required(),
  [Config.WEB_SOCKET_URL]: Joi.string().required(),
  [Config.DB_HOST]: Joi.string().required(),
  [Config.DB_PORT]: Joi.number().required(),
  [Config.DB_APP_USER]: Joi.string().required(),
  [Config.DB_APP_PASSWORD]: Joi.string().required(),
  [Config.POSTGRES_DATABASE]: Joi.string().required(),
  [Config.DB_MIGRATION_USER]: Joi.string().required(),
  [Config.DB_MIGRATION_PASSWORD]: Joi.string().required(),
  [Config.DB_LOGGING]: Joi.string().default('true').required(),
};

export const configValuesValidationSchema = Joi.object(configValuesDefinitions);
