const express = require('express');
const router = express.Router();
const dataController = require('../controllers/tenant/dataController');
const { verifyTenantUserToken } = require('../middlewares/token.middleware');
const tenantMiddleware = require('../middlewares/tenant.middleware');

// Apply token + tenant middleware to all data routes
router.use(verifyTenantUserToken);
router.use(tenantMiddleware);

router.post('/', dataController.createData);
router.get('/', dataController.getData);
router.get('/:id', dataController.getDataById);
router.put('/:id', dataController.updateData);
router.delete('/:id', dataController.deleteData);

module.exports = router;
