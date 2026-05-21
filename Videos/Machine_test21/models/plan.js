'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Plan.hasMany(
        models.Subscriptions, 
        { 
          foreignKey: 'planId', 
          as: 'subscriptions' 
        }
      );
    }
  }
  Plan.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    monthlyQuota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    extraChargePerUnit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Plan',
  });
  return Plan;
};