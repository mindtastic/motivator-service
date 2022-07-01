import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => (
  sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  })
);
