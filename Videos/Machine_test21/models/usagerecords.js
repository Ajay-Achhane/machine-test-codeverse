'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsageRecords extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UsageRecords.belongsTo(
        models.User, 
        { 
          foreignKey: 'userId',
          as: 'user' 
        }
      );
    }
  }
  UsageRecords.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usedUnits: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UsageRecords',
  });
  return UsageRecords;
};