import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
// import { SequelizeStorage, Umzug } from 'umzug';

import dbConfig from '../config/db.config';
import Models from './models';

declare type LogFn = (message: Record<string, unknown>) => void;
declare type Logger = Record<'info' | 'warn' | 'error' | 'debug', LogFn> | undefined;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const models = Models.create(sequelize);

const getMigrations = (logger: Logger = undefined) => (new Umzug({
  migrations: {
    glob: '**/migrations/*.{js,ts}',
    /* Umzug uses commonJS modules instead of ESM.
    Therefore, we have to provide our own
    function to resolve import */
    resolve: (params) => {
      const getModule = async () => {
        const mod = await import(`file:///${params.path?.replace(/\\/g, '/')}`);
        return mod.default;
      };
      return {
        name: params.name,
        path: params.path,
        up: async (upParams) => (await getModule()).up(upParams),
        down: async (downParams) => (await getModule()).down(downParams),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger,
})
);

export default {
  sequelize,
  models,
  migrations: (l: Logger) => getMigrations(l),
  migrationsWithoutLogging: () => getMigrations(),
};
