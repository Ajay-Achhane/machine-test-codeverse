const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/user/userController');
const { verifyUserToken } = require("../middlewares/token.middleware");

//middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(express.static("public"));

// Public User APIs
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get("/details/:id", userController.details);

// Protected APIs
router.get("/list", verifyUserToken, userController.list);
router.put('/update/:id', verifyUserToken, userController.update);
router.delete('/delete/:id', verifyUserToken, userController.deleteUser);

module.exports = router;