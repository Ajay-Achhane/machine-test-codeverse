'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Subscriptions.belongsTo(models.User, 
        { foreignKey: 'userId',
          as: 'user' }
      );
      Subscriptions.belongsTo(models.Plan,
        { foreignKey: 'planId',
          as: 'plan' }
      );
    }
  }
  Subscriptions.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    // isActive: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true
    // }
  }, {
    sequelize,
    modelName: 'Subscriptions',
  });
  return Subscriptions;
};