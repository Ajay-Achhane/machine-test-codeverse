const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const usageController = require("../controllers/usageController");

// User Routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Usage Routes
router.post("/usage", usageController.recordUsage);
router.get("/users/:id/current-usage", usageController.getCurrentUsage);
router.get("/users/:id/billing-summary", usageController.getBillingSummary);

module.exports = router;