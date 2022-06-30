module.exports = (sequelize, DataTypes) => (
  sequelize.define('MotivatorResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('done', 'in progress'),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.ENUM('good', 'meh', 'bad'),
    },
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'MotivatorResults',
  })
);
