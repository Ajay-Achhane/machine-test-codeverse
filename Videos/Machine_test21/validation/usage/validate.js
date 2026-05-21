const validator = require("validatorjs");
const constants = require("../../constants/en");

const usageValidation = {
  recordUsage: (data) => {
    const rules = {
      userId: "required|integer",
      action: "required|string",
      usedUnits: "required|integer|min:1",
    };

    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },
};

module.exports = usageValidation;
