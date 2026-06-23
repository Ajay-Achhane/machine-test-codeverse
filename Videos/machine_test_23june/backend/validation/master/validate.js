const validator = require("validatorjs");
const constants = require("../../constants/en");

const masterValidation = {
  login: (data) => {
    const rules = {
      email: "required|email",
      password: "required|min:6",
    };
    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },
  createUser: (data) => {
    const rules = {
      name: "required|string",
      email: "required|email",
      password: "required|min:6",
    };
    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  }
};

module.exports = masterValidation;
