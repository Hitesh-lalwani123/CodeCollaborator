import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

function onChange(newValue) {
  console.log("change", newValue);
}

const socket = io.connect("http://localhost:3001");

function App() {
  const [users, setUsers] = useState();
  const [messageReceived, setMessageRecieved] = useState("");

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessageRecieved(messageReceived + data);
    });
  }, [socket]);
  socket.on("user-change", (data) => {
    setUsers(data);
  });


  socket.on("new-connection", (users) => {
    setMessageRecieved(users);
  });

  return (
    <div className="App container">
      <textarea
        type="text"
        style={{
          width: "1000px",
          height: "100px",
          border: "2px solid red",
        }}
        onChange={(e) => {
          setMessageRecieved(e.target.value);
          socket.emit("send-message", e.target.value);
        }}
        value={messageReceived}
      />

      <h1>Users: {users}</h1>
    </div>
  );
}

export default App;
