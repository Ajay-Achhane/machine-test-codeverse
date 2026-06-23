const bcrypt = require("bcrypt");
const userServices = require("../../services/userServices");
const tenantUserServices = require("../../services/tenantUserServices");
const generateToken = require("../../utility/generatetoken");
const validators = require("../../validation/master/validate");
const constants = require("../../constants/en");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validation = validators.login(req.body);
        if (!validation.status) {
            return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: validation.message });
        }

        const master = await userServices.getOne({ email, role: 'master' });

        if (!master) {
            return res.status(constants.UNAUTHORIZED_STATUS_CODE || 401).json({ success: false, message: constants.INVALID_EMAIL_OR_PASSWORD || "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, master.password);
        if (!isMatch) {
            return res.status(constants.UNAUTHORIZED_STATUS_CODE || 401).json({ success: false, message: constants.INVALID_EMAIL_OR_PASSWORD || "Invalid credentials" });
        }

        const token = generateToken(master);
        return res.status(constants.SUCCESS_STATUS_CODE || 200).json({ success: true, message: "Master Login Success", token });
    } catch (error) {
        return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const tenantDb = req.user.tenantDb; // From token middleware

        const validation = validators.createUser(req.body);
        if (!validation.status) {
            return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: validation.message });
        }

        if (!tenantDb) {
            return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: "Tenant DB not configured for this master" });
        }
        
        const isExist = await tenantUserServices.getOne(tenantDb, { email });
        if (isExist) {
            return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: constants.EMAIL_ALREADY_EXISTS || "Email already in use in this tenant" });
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        const result = await tenantUserServices.create(tenantDb, {
            name,
            email,
            password: hashPassword,
            role: "tenant_user",
            tenantDb
        });

        if (!result) {
            return res.status(constants.SOMETHING_WENT_WRONG_STATUS_CODE || 500).json({
                success: false,
                message: constants.SOMETHING_WENT_WRONG || "Failed to create user",
            });
        }

        return res.status(constants.SUCCESS_STATUS_CODE || 200).json({ success: true, message: "Tenant User created successfully", data: result });
    } catch (error) {
        return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: error.message });
    }
};

const listUsers = async (req, res) => {
    let userInfo = req.user;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const search = req.query.search ? req.query.search.trim() : "";
    const status = req.query.status;
    const orderType = req.query.orderType || "DESC";
    const orderBy = req.query.orderBy || "createdAt";
  
    let response = {};
    try {
        const tenantDb = req.user.tenantDb;
        if (!tenantDb) {
            return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: "Tenant DB not configured" });
        }

        let getEntity = {
            where: { role: 'tenant_user' },
            limit,
            offset,
            order: [[orderBy, orderType]],
        };
  
        if (search) {
            getEntity.where.name = {
                $regex: search,
                $options: "i"
            };
        }
    
        if (status) {
            getEntity.where.status = status;
        }
  
        let result = await tenantUserServices.list(tenantDb, getEntity);
  
        if (!result || result.length === 0) {
            res.statusCode = constants.NOT_FOUND_STATUS_CODE || 404;
            response.error = constants.NOT_FOUND_ERROR || "Not found";
            response.errorMessage = constants.RECORD_NOT_FOUND || "Sorry, nothing here.";
            return res.json(response);
        }
  
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

module.exports = { login, createUser, listUsers };
