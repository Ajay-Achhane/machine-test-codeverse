const connection = require("../models");
const { UsageRecords } = connection;
const sequelize = connection.sequelize;

const { Op } = require("sequelize");

const usageRecordServices = {
  getOne: async (data) => {
    try {
      const isExist = await UsageRecords.findOne({ where: data });
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
      const result = await UsageRecords.create(data).then((result) => {
        console.log(result,"===");
        
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
      const result = await UsageRecords.findAll(data);
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
      const result = await UsageRecords.update(data, { where: where });
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
      const result = await UsageRecords.destroy({ where: { id } });
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  getTotalUsageForCurrentMonth: async (userId) => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const result = await UsageRecords.findAll({
        where: {
          userId,
          createdAt: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth],
          },
        },
        attributes: [[sequelize.fn('SUM', sequelize.col('usedUnits')), 'totalUnits']],
      });

      if (result && result[0]) {
        return result[0].dataValues.totalUnits || 0;
      }
      return 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  },

  getUsageRecordsForCurrentMonth: async (userId) => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const result = await UsageRecords.findAll({
        where: {
          userId,
          createdAt: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth],
          },
        },
      });

      if (result) {
        return result;
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
};

module.exports = usageRecordServices;
