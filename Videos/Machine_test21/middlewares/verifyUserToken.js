const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";
const constants = require("../constants/en");

const verifyUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(constants.UNAUTHORIZED_STATUS_CODE)
      .json({ success: false, message: constants.ACCESS_DENIED_ERROR });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "user" && decoded.role !== "admin") {
      return res.status(constants.FORBIDDEN_STATUS_CODE || 403).json({
        success: false,
        message: "Access denied. User or Admin access required.",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(constants.UNAUTHORIZED_STATUS_CODE)
      .json({ success: false, message: constants.TOKEN_INVALID });
  }
};

module.exports = verifyUserToken;
