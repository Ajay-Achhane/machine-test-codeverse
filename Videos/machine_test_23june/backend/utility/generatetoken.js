const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key";
const generateToken = (data) => {
    return jwt.sign({
        id: data.id || data._id,
        email: data.email,
        name: data.name,
        role: data.role,
        tenantDb: data.tenantDb,
    }, SECRET_KEY, {
        expiresIn: "1h",
    });
}

module.exports = generateToken;