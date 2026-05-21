'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
    },
     password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt :{
      allowNull : false,
      type:DataTypes.DATE
    },
     updatedAt :{
      allowNull : false,
      type:DataTypes.DATE
    },
     deletedAt :{
      allowNull : true,
      type:DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};