module.exports = (sequelize, DataTypes) => (
  sequelize.define('Motivator', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    headline: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: true,
    paranoid: true,
    tableName: 'Motivators',
  })
);
