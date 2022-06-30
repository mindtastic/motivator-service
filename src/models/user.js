module.exports = (sequelize, DataTypes) => (
  sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  }, {
    timestamps: false,
    paranoid: false,
  })
);
