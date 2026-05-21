const connection = require("../models");
const { User } = connection;
const sequelize = connection.sequelize;
const { Op } = require("sequelize");

const userServices = {
  getOne: async (data) => {
    try {
      const isExist = await User.findOne({ where: data });
      if (isExist) {
        return isExist;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  create: async (data) => {
    try {
      const result = await User.create(data).then((result) => {
        return result;
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  list: async (data) => {
    try {
      const result = await User.findAll(data);
      if (result) {
        return result;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  update: async (where, data) => {
    try {
      const result = await User.update(data, { where: where });
      if (result) {
        return result;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  delete: async (id) => {
    try {
      const result = await User.destroy({ where: { id } });
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  getCount: async (where) => {
    try {
      const result = await User.count({ where });
      if (result) {
        return result;
      }
      return 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  },
};

module.exports = userServices;
