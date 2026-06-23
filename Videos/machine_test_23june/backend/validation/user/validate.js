const validator = require("validatorjs");
const constants = require("../../constants/en");

const userValidation = {
  register: (data) => {
    const rules = {
      name: "required|string",
      email: "required|email",
      // mobile: "required|numeric",
      password: "required|min:6",
      // role: "string|in:user,admin",
      // profile: "string|in:public,private",
      // address: "array",
    };

    const validation = new validator(data, rules);
    if (validation.fails()) {
      return { status: false, message: validation.errors.all() };
    }
    return { status: true, message: constants.VALIDATION_SUCCESS };
  },

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
};

module.exports = userValidation;
