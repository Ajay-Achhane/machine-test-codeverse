const bcrypt = require("bcrypt");
const generateToken = require("../../utility/generatetoken");
const tenantUserServices = require("../../services/tenantUserServices");
const validators = require("../../validation/tenantUser/validate");

const login = async (req, res) => {
    try {
        const { email, password, tenantDb } = req.body;
        
        const validation = validators.login(req.body);
        if (!validation.status) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        const tenantUser = await tenantUserServices.getOne(tenantDb, { email, role: 'tenant_user' });

        if (!tenantUser) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, tenantUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken({
            id: tenantUser._id,
            email: tenantUser.email,
            name: tenantUser.name,
            role: tenantUser.role,
            tenantDb: tenantDb
        });

        return res.json({ success: true, message: "Tenant User Login Success", token });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const profile = async (req, res) => {
    try {
        const { id, tenantDb } = req.user;
        const tenantUser = await tenantUserServices.getOne(tenantDb, { _id: id });

        if (!tenantUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        tenantUser.password = undefined;

        return res.json({ success: true, data: tenantUser });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { login, profile };
