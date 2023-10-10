const mongoose = require("mongoose");

const notesModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, trim: true },
    content: { type: String, trim: true },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    color: { type: String, default: "yellow" },
    position: {
      type: {
        x: { type: Number, defaul: 0 },
        y: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", notesModel);

module.exports = Note;
