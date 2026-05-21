const jwt = require("jsonwebtoken");
const SECRET_KEY = "test-secret-key12345";

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
};

module.exports = generateToken;
