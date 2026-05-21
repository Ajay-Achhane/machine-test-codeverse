const connection = require("../models");
const { Subscriptions } = connection;
const sequelize = connection.sequelize;
const { Op } = require("sequelize");

const subscriptionServices = {
  getOne: async (data) => {
    try {
      const isExist = await Subscriptions.findOne({ where: data });
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
      const result = await Subscriptions.create(data).then((result) => {
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
      const result = await Subscriptions.findAll(data);
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
      const result = await Subscriptions.update(data, { where: where });
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
      const result = await Subscriptions.destroy({ where: { id } });
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  getActiveSubscriptionByUserId: async (userId) => {
    try {
      const result = await Subscriptions.findOne({
        where: {
          userId,
          // isActive: true,
        },
        include: ['plan'],
      });
      if (result) {
        return result;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = subscriptionServices;
