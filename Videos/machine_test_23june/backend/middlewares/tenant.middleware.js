const tenantMiddleware = (req, res, next) => {
    const tenantDb = req.user?.tenantDb || req.headers['x-tenant-db'];

    if (!tenantDb) {
        return res.status(400).json({ success: false, message: "Tenant DB is missing" });
    }

    req.tenantDb = tenantDb;
    next();
};

module.exports = tenantMiddleware;
