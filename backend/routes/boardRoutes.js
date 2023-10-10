const express = require("express");
const {
  createBoard,
  addMemberToBoard,
  removeMemberFromBoard,
  fetchBoard,
  fetchBoardNotes,
  renameBoard,
} = require("../controllers/boardControllers");

const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, createBoard);
router.route("/").get(protect, fetchBoard);
router.route("/boardadd").put(protect, addMemberToBoard);
router.route("/boardremove").put(protect, removeMemberFromBoard);
router.route("/:boardId/notes").get(protect, fetchBoardNotes);
router.route("/rename").put(protect, renameBoard);
module.exports = router;
