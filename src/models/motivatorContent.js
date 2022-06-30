module.exports = (sequelize, DataTypes) => (
  sequelize.define('MotivatorContent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ordering: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
    },
  }, {
    timestamps: false,
    paranoid: false,
    tableName: 'MotivatorContents',
  })

);
