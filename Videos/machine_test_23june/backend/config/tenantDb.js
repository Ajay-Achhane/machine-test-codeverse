const mongoose = require('mongoose');

const getTenantModel = (tenantDbName, modelName, schema) => {
  try {
    const conn = mongoose.connection.useDb(tenantDbName);
    return conn.model(modelName, schema);
  } catch (error) {
    console.error(`Tenant DB Error: ${error.message}`);
    throw error;
  }
};

module.exports = { getTenantModel };
