const asyncHandler = require("express-async-handler");
const Note = require("../Models/notesModel");
const Board = require("../Models/boardModel");

const createNote = asyncHandler(async (req, res) => {
  const { title, content, boardId, color, position } = req.body;

  if (!title || !content || !boardId || !color || !position) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  try {
    const newNote = await Note.create({
      title,
      content,
      sender: req.user._id,
      board: boardId,
      color,
      position,
    });

    // Push the note's ID into the board's notes array
    await Board.findByIdAndUpdate(
      boardId,
      { $push: { notes: newNote._id } },
      { new: true }
    );

    const fullNote = await Note.findOne({ _id: newNote._id })
      .populate("sender", "-password")
      .populate("board");

    res.status(200).json(fullNote);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }

    // Check if the current user is the sender of the note
    if (note.sender.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error("You do not have permission to remove this note");
    }

    const boardId = note.board;

    // Remove the note's ID from the board's notes array
    await Board.findByIdAndUpdate(
      boardId,
      { $pull: { notes: noteId } },
      { new: true }
    );

    // Remove the note using deleteOne()
    await Note.deleteOne({ _id: noteId });

    res.status(200).json({ message: "Note removed successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content, color, position } = req.body;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }

    // Check if the current user is the sender of the note
    if (note.sender.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error("You do not have permission to update this note");
    }

    // Update the note fields
    note.title = title || note.title;
    note.content = content || note.content;
    note.color = color || note.color;

    if (position) {
      note.position = position;
    }

    // Save the updated note
    await note.save();

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  createNote,
  removeNote,
  updateNote,
};
