import { DataTypes } from 'sequelize';
import { createTableMigration } from '../migrationHelpers';

export default createTableMigration('MotivatorInputs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  motivator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Motivators', key: 'id' },
  },
});
