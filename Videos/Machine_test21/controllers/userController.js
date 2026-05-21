const bcrypt = require("bcrypt");
const userServices = require("../services/userServices");
const validators = require("../validation/user/validate");
const generateToken = require("../utility/generatetoken");
const constants = require("../constants/en");

const signup = async (req, res) => {
  try {
    const { name, email,password } = req.body;

    const validation = validators.register(req.body);
    if (!validation.status) {
      return res
        .status(constants.BAD_REQUEST_STATUS_CODE)
        .json({ success: false, message: validation.message });
    }

    const isExist = await userServices.getOne({ email });
    if (isExist) {
      return res
        .status(constants.BAD_REQUEST_STATUS_CODE)
        .json({ success: false, message: constants.EMAIL_ALREADY_EXISTS });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await userServices.create({
      name,
      email,
      password: hashPassword,
    });

    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      message: constants.USER_REGISTER_SUCCES,
    });
  } catch (error) {
    return res
      .status(constants.BAD_REQUEST_STATUS_CODE)
      .json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validators.login(req.body);

    if (!validation.status) {
      return res
        .status(constants.BAD_REQUEST_STATUS_CODE)
        .json({ success: false, message: validation.message });
    }

    const existingUser = await userServices.getOne({ email });

    if (!existingUser) {
      return res
        .status(constants.UNAUTHORIZED_STATUS_CODE)
        .json({ success: false, message: constants.INVALID_EMAIL_OR_PASSWORD });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(constants.UNAUTHORIZED_STATUS_CODE)
        .json({ success: false, message: constants.INVALID_EMAIL_OR_PASSWORD });
    }

    // Generate JWT token
    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      message: constants.USER_LOGIN_SUCCESS,
      token,
    });
  } catch (error) {
    return res
      .status(constants.BAD_REQUEST_STATUS_CODE)
      .json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  login,
};
