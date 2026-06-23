const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";
const constants = require("../constants/en");

const verifyMasterToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(constants.UNAUTHORIZED_STATUS_CODE || 401)
      .json({ success: false, message: constants.ACCESS_DENIED_ERROR || "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "master") {
      return res.status(constants.FORBIDDEN_STATUS_CODE || 403).json({
        success: false,
        message: "Access denied. Master access required.",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(constants.UNAUTHORIZED_STATUS_CODE || 401)
      .json({ success: false, message: constants.TOKEN_INVALID || "Invalid token" });
  }
};

module.exports = verifyMasterToken;
