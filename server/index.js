const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
// setting middleware
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


app.get('/',()=>{
  console.log('on Homepage')
})
let mydata = "";
let users = 0;
io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  users = users+1;
  socket.emit("new-connection", mydata,users);
  io.emit('user-change',users);
  socket.on("send-message", (data) => {
    mydata = data;
    socket.broadcast.emit("receive-message", mydata);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    users = users-1;
    io.emit('user-change',users);
  });
  
  

  
});

// io.emit("send-users", users);

server.listen(3001, () => {
  console.log("server is running");
});
