const validator = require("validatorjs");
const constants = require("../../constants/en");

const subscriptionValidation = {
  create: (data) => {
    const rules = {
      userId: "required|integer",
      planId: "required|integer",
      startDate: "required|date",
      isActive: "boolean",
    };

    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },

  update: (data) => {
    const rules = {
      userId: "integer",
      planId: "integer",
      startDate: "date",
      isActive: "boolean",
    };

    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },
};

module.exports = subscriptionValidation;
