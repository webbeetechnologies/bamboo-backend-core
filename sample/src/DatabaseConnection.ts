import {DatabaseConnector} from 'flashdb';
import {DataSource} from 'typeorm';

export const dbConnector = new DatabaseConnector({
  dbName: 'db.sqlite',
  host: 'http://localhost:5000',
  dumpUrl: '/logger/db-dump',
  updateUrl: '/logger/db-updates',
  maxSyncRetries: 10,
});

export const dataSource = new DataSource({
  driver: dbConnector,
  type: 'flashdb',
  synchronize: false,
  logging: true,
  subscribers: [],
  migrations: [],
});
