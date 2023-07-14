const express = require("express");
const {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-question", createQuestion);
router.delete("/question/:id", authMiddleware, deleteQuestion);
router.put("/question/:id", authMiddleware, updateQuestion);

module.exports = router;
