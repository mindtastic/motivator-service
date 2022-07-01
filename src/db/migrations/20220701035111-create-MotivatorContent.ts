import { DataTypes } from 'sequelize';
import { createTableMigration } from '../migrationHelpers';

export default createTableMigration('MotivatorContents', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ordering: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  motivator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Motivators', key: 'id' },
  },
});
