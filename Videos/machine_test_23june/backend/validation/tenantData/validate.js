const validator = require("validatorjs");
const constants = require("../../constants/en");

const tenantDataValidation = {
  create: (data) => {
    const rules = {
      title: "required|string",
      description: "required|string",
      status: "string|in:active,inactive",
    };
    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },
  update: (data) => {
    const rules = {
      title: "string",
      description: "string",
      status: "string|in:active,inactive",
    };
    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  }
};

module.exports = tenantDataValidation;
