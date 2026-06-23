const users = require("../models/users");

const userServices = {
  getOne: async (data) => {
    try {
      const isExist = await users.findOne(data);
      if (isExist) {
        return isExist;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  create: async (data) => {
    try {
      const result = await users.create(data);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  list: async (data) => {
    try {
      const query = data.where || {};
      const sortMap = {};
      if (data.order && data.order.length > 0) {
        sortMap[data.order[0][0]] = data.order[0][1] === "ASC" ? 1 : -1;
      }

      const result = await users.find(query)
        .skip(data.offset || 0)
        .limit(data.limit || 10)
        .sort(sortMap);
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
      const result = await users.updateOne(where, { $set: data });
      if (result.matchedCount > 0) {
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
      const result = await users.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  getCount: async (where) => {
    try {
      const result = await users.countDocuments(where);
      return result;
    } catch (error) {
      console.log(error);
      return 0;
    }
  },

  graph: async (startDate, endDate) => {
    try {
      const result = await users.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1
          }
        },
        {
          $sort: { date: 1 }
        }
      ]);
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
};

module.exports = userServices;
