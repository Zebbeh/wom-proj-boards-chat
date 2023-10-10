const mongoose = require("mongoose");

const boardModel = mongoose.Schema(
  {
    boardName: { type: String, trim: true },
    boardAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model("Board", boardModel);
module.exports = Board;
