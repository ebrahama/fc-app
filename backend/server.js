const express = require("express");
const dotenv = require("dotenv");
const {chat} = require("./data/data")
const condb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const  messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const path = require("path");


dotenv.config();
condb()
const app = express();

app.use(express.json()); 



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// deployment
 __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>{
      res.sendFile(path.resolve(__dirname, "/frontend/build", "index.html"));
   });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}



// deployment



app.use(notFound)
app.use(errorHandler)

 
const PORT = process.env.PORT || 5000;

const server = app.listen(
  `${PORT}`, 
  console.log(`server work on P ${PORT}`)
  );

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData)=>{
  socket.join(userData._id);
  socket.emit("connected");
  });

  socket.on("join chat", (room)=>{
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room)=> socket.in(room).emit("typing"));
  socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"));



  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

  });
