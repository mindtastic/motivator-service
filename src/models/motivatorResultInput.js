module.exports = (sequelize, DataTypes) => (
  sequelize.define('MotivatorResultInput', {
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
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'MotivatorResultInputs',
  })
);
