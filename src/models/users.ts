import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => (
  sequelize.define('users', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  }, {
    timestamps: false,
    paranoid: false,
  })
);