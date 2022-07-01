import { Dialect } from 'sequelize/types';

const dbConfig = {
  host: 'postgres',
  username: 'root',
  password: 'root',
  database: 'motivator',
  dialect: 'postgres' as Dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfig;
