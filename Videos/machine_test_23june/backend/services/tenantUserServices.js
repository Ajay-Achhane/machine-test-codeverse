const { getTenantModel } = require("../config/tenantDb");
const centralUserSchema = require("../models/users").schema;

const getModel = (tenantDb) => {
    return getTenantModel(tenantDb, "users", centralUserSchema);
};

const tenantUserServices = {
  getOne: async (tenantDb, data) => {
    try {
      const Model = getModel(tenantDb);
      const isExist = await Model.findOne(data);
      if (isExist) {
        return isExist;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  create: async (tenantDb, data) => {
    try {
      const Model = getModel(tenantDb);
      const result = await Model.create(data);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  list: async (tenantDb, data) => {
    try {
      const Model = getModel(tenantDb);
      const query = data.where || {};
      const sortMap = {};
      if (data.order && data.order.length > 0) {
        sortMap[data.order[0][0]] = data.order[0][1] === "ASC" ? 1 : -1;
      }

      const result = await Model.find(query)
        .populate(data.populate || [])
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

  update: async (tenantDb, where, data) => {
    try {
      const Model = getModel(tenantDb);
      const result = await Model.findOneAndUpdate(where, data, { new: true });
      if (result) {
        return result;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  delete: async (tenantDb, where) => {
    try {
      const Model = getModel(tenantDb);
      const result = await Model.deleteOne(where);
      if (result.deletedCount > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = tenantUserServices;
