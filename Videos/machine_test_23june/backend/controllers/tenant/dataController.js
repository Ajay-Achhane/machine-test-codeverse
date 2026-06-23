const tenantDataServices = require("../../services/tenantDataServices");
const validators = require("../../validation/tenantData/validate");
const constants = require("../../constants/en");

const createData = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const validation = validators.create(req.body);
        if (!validation.status) {
            return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: validation.message });
        }

        const data = await tenantDataServices.create(req.tenantDb, {
            title,
            description,
            status,
            createdBy: req.user.id
        });

        if (!data) {
            return res.status(constants.SOMETHING_WENT_WRONG_STATUS_CODE || 500).json({
                success: false,
                message: constants.SOMETHING_WENT_WRONG || "Failed to create data",
            });
        }

        return res.status(constants.SUCCESS_STATUS_CODE || 200).json({ success: true, message: "Data created successfully", data });
    } catch (error) {
        return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: error.message });
    }
};

const getData = async (req, res) => {
    let userInfo = req.user;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const search = req.query.search ? req.query.search.trim() : "";
    const status = req.query.status;
    const orderType = req.query.orderType || "DESC";
    const orderBy = req.query.orderBy || "createdAt";

    let response = {};
    try {
        let getEntity = {
            where: { deletedAt: null },
            limit,
            offset,
            order: [[orderBy, orderType]],
            populate: { path: "createdBy", select: "name email role" }
        };

        if (search) {
            getEntity.where.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (status) {
            getEntity.where.status = status;
        }

        let result = await tenantDataServices.list(req.tenantDb, getEntity);

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

const getDataById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await tenantDataServices.getOne(req.tenantDb, { _id: id, deletedAt: null });

        if (!data) {
            return res.status(constants.NOT_FOUND_STATUS_CODE || 404).json({ success: false, message: "Data not found" });
        }

        return res.status(constants.SUCCESS_STATUS_CODE || 200).json({ success: true, data });
    } catch (error) {
        return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: error.message });
    }
};

const updateData = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const validation = validators.update(req.body);
        if (!validation.status) {
            return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: validation.message });
        }

        const data = await tenantDataServices.update(req.tenantDb,
            { _id: id, deletedAt: null },
            { title, description, status }
        );

        if (!data) {
            return res.status(constants.NOT_FOUND_STATUS_CODE || 404).json({ success: false, message: "Data not found or deleted" });
        }

        return res.status(constants.SUCCESS_STATUS_CODE || 200).json({ success: true, message: "Data updated successfully", data });
    } catch (error) {
        return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: error.message });
    }
};

const deleteData = async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete
        const data = await tenantDataServices.update(req.tenantDb,
            { _id: id, deletedAt: null },
            { deletedAt: new Date() }
        );

        if (!data) {
            return res.status(constants.NOT_FOUND_STATUS_CODE || 404).json({ success: false, message: "Data not found" });
        }

        return res.status(constants.SUCCESS_STATUS_CODE || 200).json({ success: true, message: "Data deleted successfully" });
    } catch (error) {
        return res.status(constants.BAD_REQUEST_STATUS_CODE || 400).json({ success: false, message: error.message });
    }
};

module.exports = { createData, getData, getDataById, updateData, deleteData };
