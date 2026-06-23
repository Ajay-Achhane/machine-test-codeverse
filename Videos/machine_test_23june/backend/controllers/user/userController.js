const bcrypt = require("bcrypt");
const userServices = require("../../services/userServices");
const validators = require("../../validation/user/validate");
const generateToken = require("../../utility/generatetoken");
const constants = require("../../constants/en");

const signup = async (req, res) => {
  try {
    const { name, email, password, role, profile, address } = req.body;

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
      role: role || "user",
      profile: profile || "public",
      address: address ? JSON.parse(address) : null,
    });

    if (!result) {
      return res.status(constants.SOMETHING_WENT_WRONG_STATUS_CODE || 500).json({
        success: false,
        message: constants.SOMETHING_WENT_WRONG || "Failed to create user",
      });
    }

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
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
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

const details = async (req, res) => {
  try {
    const { id } = req.params;

    let userData = await userServices.getOne({ _id: id });
    if (!userData) {
      return res.status(constants.NOT_FOUND_STATUS_CODE || 404).json({
        success: false,
        message: constants.USER_ID_NOT_EXIST || "User not found",
      });
    }

    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    return res
      .status(constants.BAD_REQUEST_STATUS_CODE)
      .json({ success: false, message: error.message });
  }
};

const list = async (req, res) => {
  let userInfo = req.user; // From middleware
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const search = req.query.search ? req.query.search.trim() : "";
  const status = req.query.status;
  const orderType = req.query.orderType || "DESC";
  const orderBy = req.query.orderBy || "createdAt";

  let response = {};
  try {
    let getEntity = {
      where: {},
      limit,
      offset,
      order: [[orderBy, orderType]],
    };

    // search
    if (search) {
      getEntity.where.name = {
        $regex: search,
        $options: "i"
      };
    }

    // status
    if (status) {
      getEntity.where.status = status;
    } else {
      // getEntity.where.status = "active";
    }

    // fetch result
    let result = await userServices.list(getEntity);

    if (result && userInfo && userInfo.role !== "admin") {
      result = result.filter((user) => {
        const userData = user.toObject ? user.toObject() : user;
        return userData._id.toString() !== userInfo.id.toString();
      });
    }

    if (!result || result.length === 0) {
      res.statusCode = constants.NOT_FOUND_STATUS_CODE || 404;
      response.error = constants.NOT_FOUND_ERROR || "Not found";
      response.errorMessage = constants.RECORD_NOT_FOUND || "Sorry, nothing here.";
      return res.json(response);
    }

    // ---- FINAL RESPONSE ----
    res.statusCode = constants.SUCCESS_STATUS_CODE || 200;
    return res.json({
      message: constants.SUCCESS || "Success",
      count: result.length,
      results: result,
    });
  } catch (err) {
    console.log("list error:", err);
    res.statusCode = constants.SOMETHING_WENT_WRONG_STATUS_CODE || 500;
    return res.json({
      errorMessage: constants.SOMETHING_WENT_WRONG || "Something went wrong",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profile, address } = req.body;
    const loginUser = req.user;

    if (loginUser.role !== "admin" && String(loginUser.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot update other users",
      });
    }

    const userData = await userServices.getOne({ _id: id });
    if (!userData) {
      return res.status(constants.NOT_FOUND_STATUS_CODE || 404).json({
        success: false,
        message: constants.USER_ID_NOT_EXIST || "User not found",
      });
    }

    const updateUser = await userServices.update(
      { _id: userData._id },
      { name, profile, address },
    );
    if (!updateUser) {
      return res
        .status(constants.BAD_REQUEST_STATUS_CODE)
        .json({ success: false, message: constants.FAILED_TO_UPDATE_USER });
    }
    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      message: constants.USER_UPDATE_SUCCESS,
    });
  } catch (error) {
    return res
      .status(constants.BAD_REQUEST_STATUS_CODE)
      .json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const loginUser = req.user;

    const userData = await userServices.getOne({ _id: id });
    if (!userData) {
      return res.status(constants.NOT_FOUND_STATUS_CODE || 404).json({
        success: false,
        message: constants.USER_ID_NOT_EXIST || "User not found",
      });
    }

    if (
      loginUser.role !== "admin" &&
      String(loginUser.id) !== String(id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete other users",
      });
    }

    const deletedUser = await userServices.delete(userData._id);
    if (!deletedUser) {
      return res
        .status(constants.BAD_REQUEST_STATUS_CODE)
        .json({ success: false, message: constants.FAILED_TO_DELETE_USER });
    }
    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      message: constants.USER_DELETED_SUCCESS,
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
  list,
  details,
  update,
  deleteUser,
};
