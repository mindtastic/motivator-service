import { DataTypes } from 'sequelize';
import { createTableMigration } from '../migrationHelpers';

export default createTableMigration('Users', {
  uid: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
});
