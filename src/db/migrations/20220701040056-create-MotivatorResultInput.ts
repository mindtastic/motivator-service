import { DataTypes } from 'sequelize';
import { createTableMigration } from '../migrationHelpers';

export default createTableMigration('MotivatorResultInputs', {
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
  motivator_result_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'MotivatorResults', key: 'id' },
  },
});
