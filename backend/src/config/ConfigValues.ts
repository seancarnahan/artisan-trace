import { Config } from './Config';

export interface ConfigValues {
  [Config.AWS_REGION]: string | undefined;
  [Config.AWS_ACCESS_KEY_ID]: string | undefined;
  [Config.AWS_SECRET_ACCESS_KEY]: string | undefined;
  [Config.DEPLOY_ENV]: string;
  [Config.PORT]: string | undefined;
  [Config.SERVICE_ACCOUNT_USER]: string;
  [Config.SERVICE_ACCOUNT_PASS]: string;
  [Config.LD_SHARED_SERVICES_KEY]: string | undefined;
  [Config.TOKEN_EXCHANGE_SERVICE_URL]: string;
  [Config.TRANSACTION_SERVICE_URL]: string;
  [Config.OPEN_AI_API_KEY]: string;
  [Config.OPEN_AI_PROJECT]: string;
  [Config.OPEN_AI_ORGANIZATION]: string;
  [Config.OPEN_AI_MODEL]: string;
  [Config.SLACK_BOT_TOKEN]: string;
  [Config.SLACK_SIGNING_SECRET]: string;
  [Config.SLACK_APP_TOKEN]: string;
  [Config.WEB_SOCKET_URL]: string;
  [Config.DB_HOST]: string;
  [Config.DB_PORT]: number;
  [Config.DB_APP_USER]: string;
  [Config.DB_APP_PASSWORD]: string;
  [Config.POSTGRES_DATABASE]: string;
  [Config.DB_MIGRATION_USER]: string;
  [Config.DB_MIGRATION_PASSWORD]: string;
  [Config.DB_LOGGING]: string;
}
