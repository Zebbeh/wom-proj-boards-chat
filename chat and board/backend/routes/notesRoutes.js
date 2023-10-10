const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createNote,
  removeNote,
  updateNote,
} = require("../controllers/noteController");

const router = express.Router();

router.route("/").post(protect, createNote);
router.route("/:noteId").delete(protect, removeNote).put(protect, updateNote);

module.exports = router;
