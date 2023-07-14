const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createTestCase } = require("../controllers/testcaseController");

const router = express.Router();

router.post("/create-testcase", authMiddleware, createTestCase);

module.exports = router;
