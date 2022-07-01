import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config';
import { mapObject } from '../util';

import motivator from './motivator';
import motivatorContent from './motivatorContent';
import motivatorResult from './motivatorResult';
import motivatorResultInput from './motivatorResultInput';
import user from './users';

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

const models = mapObject({
  motivator,
  motivatorContent,
  motivatorResult,
  motivatorResultInput,
  user,
}, (m: Function) => m(sequelize));

const db = {
  sequelize,
  ...models,
};

// Motivator 1-to-many Motivatorcontents

db.motivator.hasMany(db.motivatorContent);
db.motivatorContent.belongsTo(db.motivator);

// Motivator 1-to-many MotivatorResult

db.motivator.hasMany(db.motivatorResult);
db.motivatorResult.belongsTo(db.motivator);

// User 1-to-many MotivatorResult

db.user.hasMany(db.motivatorResult);
db.motivatorResult.belongsTo(db.user);

// MotivatorResult 1-to-many MotivatorResultInput

db.motivatorResult.hasMany(db.motivatorResultInput);
db.motivatorResultInput.belongsTo(db.motivatorResult);

export default db;
