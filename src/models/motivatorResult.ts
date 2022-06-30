import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => (
  sequelize.define('MotivatorResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.ENUM,
    },
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'MotivatorResults',
  })
);
