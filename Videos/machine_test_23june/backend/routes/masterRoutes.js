const express = require('express');
const router = express.Router();
const masterController = require('../controllers/master/masterUser');
const tenantUserController = require('../controllers/tenant/tenantUserController');
const { verifyMasterToken, verifyTenantUserToken } = require('../middlewares/token.middleware');
const tenantMiddleware = require('../middlewares/tenant.middleware');

// Master specific APIs
router.post('/login', masterController.login);
router.post('/user', verifyMasterToken, masterController.createUser);
router.get('/users', verifyMasterToken, masterController.listUsers);

// Master User (Tenant User) APIs
router.post('/user/login', tenantUserController.login);
router.get('/user/profile', verifyTenantUserToken, tenantMiddleware, tenantUserController.profile);

module.exports = router;
