const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadmin/superadminController');
const { verifySuperAdminToken } = require('../middlewares/token.middleware');

router.post('/login', superadminController.login);
router.post('/master', verifySuperAdminToken, superadminController.createMaster);
router.get('/masters', verifySuperAdminToken, superadminController.listMasters);

module.exports = router;
