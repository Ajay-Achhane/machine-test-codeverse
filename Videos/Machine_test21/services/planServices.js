const connection = require("../models");
const { Plan } = connection;
const sequelize = connection.sequelize;

const planServices = {
  getOne: async (data) => {
    try {
      const isExist = await Plan.findOne({ where: data });
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
      const result = await Plan.create(data).then((result) => {
        return result;
      });
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  list: async (data) => {
    try {
      const result = await Plan.findAll(data);
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
      const result = await Plan.update(data, { where: where });
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
      const result = await Plan.destroy({ where: { id } });
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = planServices;
