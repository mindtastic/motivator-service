import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => (
  sequelize.define('User', {
    uid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  })
);
