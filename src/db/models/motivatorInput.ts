import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => (
  sequelize.define('MotivatorInput', {
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
  })
);
