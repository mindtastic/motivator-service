import { Sequelize } from 'sequelize';
import { mapObject } from '../util';

import motivator from './motivator';
import motivatorContent from './motivatorContent';
import motivatorResult from './motivatorResult';
import motivatorResultInput from './motivatorResultInput';
import motivatorInput from './motivatorInput';
import user from './users';

const definitions = {
  motivator,
  motivatorContent,
  motivatorInput,
  motivatorResult,
  motivatorResultInput,
  user,
};

const create = (sequelize: Sequelize) => {
  const models = mapObject(definitions, (m) => m(sequelize));

  // Motivator 1-to-many Motivatorcontents
  models.motivator.hasMany(models.motivatorContent, { foreignKey: 'motivator_id' });
  models.motivatorContent.belongsTo(models.motivator, { foreignKey: 'motivator_id' });
  // Motivator 1-to-many MotivatorInputs
  models.motivator.hasMany(models.motivatorInput, { foreignKey: 'motivator_id' });
  models.motivatorInput.belongsTo(models.motivator, { foreignKey: 'motivator_id' });
  // Motivator 1-to-many MotivatorResult
  models.motivator.hasMany(models.motivatorResult, { foreignKey: 'motivator_id' });
  models.motivatorResult.belongsTo(models.motivator, { foreignKey: 'motivator_id' });
  // User 1-to-many MotivatorResult
  models.user.hasMany(models.motivatorResult, { foreignKey: 'user_id' });
  models.motivatorResult.belongsTo(models.user, { foreignKey: 'user_id' });
  // MotivatorResult 1-to-many MotivatorResultInput
  models.motivatorResult.hasMany(models.motivatorResultInput, { foreignKey: 'motivator_result_id' });
  models.motivatorResultInput.belongsTo(models.motivatorResult, { foreignKey: 'motivator_result_id' });

  return models;
};

export default {
  ...definitions,
  create,
};
