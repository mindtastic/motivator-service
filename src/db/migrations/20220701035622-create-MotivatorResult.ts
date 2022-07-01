import { DataTypes } from 'sequelize';
import { createTableMigration } from '../migrationHelpers';

export default createTableMigration('MotivatorResults', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('completed', 'running'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  feedback: {
    type: DataTypes.ENUM('positive', 'neutral', 'negative'),
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'uid' },
  },
  motivator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Motivators', key: 'id' },
  },
});
