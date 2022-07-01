import { DataTypes } from 'sequelize';
import { createTableMigration } from '../migrationHelpers';

export default createTableMigration('Motivators', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  headline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, { paranoid: true });
