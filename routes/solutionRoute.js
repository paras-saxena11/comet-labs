const express = require("express");
const solutionController = require("../controllers/solutionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:questionId",
  authMiddleware,
  solutionController.solutionController
);

module.exports = router;
