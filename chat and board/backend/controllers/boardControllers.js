const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const Board = require("../Models/boardModel");

const createBoard = asyncHandler(async (req, res) => {
  const { boardName, users } = req.body;
  console.log("Recieved payload: ", req.body);

  if (!boardName || !users || !Array.isArray(users)) {
    return res.status(400).send({
      message: "Please fill all the fields and provide users as an array",
    });
  }

  try {
    const allUsers = [...users, req.user._id];

    const newBoard = await Board.create({
      boardName,
      boardAdmin: req.user._id,
      users: allUsers,
    });

    const fullBoard = await Board.findOne({ _id: newBoard._id })
      .populate("users", "-password")
      .populate("boardAdmin", "-password");

    res.status(200).json(fullBoard);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addMemberToBoard = asyncHandler(async (req, res) => {
  const { boardId, userId } = req.body;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    // Check if the current user is the board admin
    if (board.boardAdmin.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error(
        "You do not have permission to add members to this board"
      );
    }

    // Add the user to the board's users array
    board.users.push(userId);
    await board.save();

    // Populate and send the updated board
    const updatedBoard = await Board.findById(boardId)
      .populate("users", "-password")
      .populate("boardAdmin", "-password");

    res.json(updatedBoard);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeMemberFromBoard = asyncHandler(async (req, res) => {
  const { boardId, userId } = req.body;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    // Check if the current user is the board admin
    if (board.boardAdmin.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error(
        "You do not have permission to remove members from this board"
      );
    }

    // Remove the user from the board's users array
    board.users.pull(userId);
    await board.save();

    // Populate and send the updated board
    const updatedBoard = await Board.findById(boardId)
      .populate("users", "-password")
      .populate("boardAdmin", "-password");

    res.json(updatedBoard);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchBoard = asyncHandler(async (req, res) => {
  try {
    const boards = await Board.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("boardAdmin", "-password")
      .populate("notes"); // Assuming you want to populate notes as well

    const populatedBoards = await User.populate(boards, {
      path: "notes.user", // Assuming there's a user field in the notes model
      select: "name pic email",
    });

    res.status(200).json(populatedBoards);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const fetchBoardNotes = asyncHandler(async (req, res) => {
  const boardId = req.params.boardId;

  try {
    const board = await Board.findById(boardId).populate("notes");

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    res.status(200).json(board.notes);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameBoard = asyncHandler(async (req, res) => {
  const { boardId, boardName } = req.body;

  const updateBoard = await Board.findByIdAndUpdate(
    boardId,
    {
      boardName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("boardAdmin", "-password");

  if (!updateBoard) {
    res.status(404);
    throw new Error("Board not found");
  } else {
    res.json(updateBoard);
  }
});

module.exports = {
  createBoard,
  addMemberToBoard,
  removeMemberFromBoard,
  fetchBoard,
  fetchBoardNotes,
  renameBoard,
};
