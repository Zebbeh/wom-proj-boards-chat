const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const boardRoutes = require("./routes/boardRoutes");
const noteRoutes = require("./routes/notesRoutes");

//process.env.DEBUG = "socket.io:*";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

//app.get("/", (req, res) => {
//  res.send("API is running");
//});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/note", noteRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("join board", (board) => {
    socket.join(board);
    console.log("user joined the board: " + board);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("note received", (newNoteAdded) => {
    var board = newNoteAdded.board;

    if (!board.users) return console.log("board.users not defined");

    io.to(board._id).emit("update board", { type: "note", data: newNoteAdded });
    console.log("Server: Sent 'update board' event to room:", board._id);
  });

  socket.on("new note", (newNoteAdded) => {
    var board = newNoteAdded.board;

    if (!board.users || !board.users)
      return console.log("invalid board or board.users not defined");

    io.to(board._id).emit("update board", { type: "note", data: newNoteAdded });
    console.log("Server: Sent 'update board' event to room:", board._id);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
});
