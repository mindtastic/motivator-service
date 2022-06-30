const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const motivators = require('./motivator.ts')(sequelize);
const motivatorContents = require('./motivatorContent.ts')(sequelize);
const motivatorResults = require('./motivatorResult.ts')(sequelize);
const motivatorResultInputs = require('./motivatorResultInput.ts')(sequelize);
const users = require('./user.ts')(sequelize);

const db = {
  Sequelize,
  sequelize,
  motivators,
  motivatorContents,
  motivatorResults,
  motivatorResultInputs,
  users,
};

// Motivator 1-to-many Motivatorcontents

db.motivators.hasMany(db.motivatorContents);
db.motivatorContents.belongsTo(db.motivators, {
  foreignKey: 'motivator_id',
});

// Motivator 1-to-many MotivatorResult

db.motivators.hasMany(db.motivatorResults);
db.motivatorResults.belongsTo(db.motivators, {
  foreignKey: 'motivator_id',
});

// User 1-to-many MotivatorResult

db.users.hasMany(db.motivatorResults);
db.motivatorResults.belongsTo(db.users, {
  foreignKey: 'user_id',
});

// MotivatorResult 1-to-many MotivatorResultInput

db.motivatorResults.hasMany(db.motivatorResultInputs);
db.motivatorResultInputs.belongsTo(db.motivatorResults, {
  foreignKey: 'result_id',
});

module.exports = db;
