const validator = require("validatorjs");
const constants = require("../../constants/en");

const planValidation = {
  create: (data) => {
    const rules = {
      name: "required|string",
      monthlyQuota: "required|integer|min:1",
      extraChargePerUnit: "required|numeric|min:0",
    };

    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },

  update: (data) => {
    const rules = {
      name: "string",
      monthlyQuota: "integer|min:1",
      extraChargePerUnit: "numeric|min:0",
    };

    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },
};

module.exports = planValidation;
