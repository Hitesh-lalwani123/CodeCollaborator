import React, { useEffect, useState } from "react";
import io from "socket.io-client";
// import EditorComponent from "./EditorComponent";
import Editor from "@monaco-editor/react";

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
  const [name, setName] = useState("No Name Entered");

  const onChange = (e) => {
    setMessageRecieved(e.target.value);
    socket.emit("send-message", e.target.value);
  };
  socket.on("new-connection", (users) => {
    setMessageRecieved(users);
  });

  const style = {
    background:'beige',
    width:'80%'
    ,display:'flex',
  }
  return (
    <div className="App container">
      <div style = {style}>Your Personalised Code collaborator</div>

      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <Editor
            className="text-xl"
            height="85vh"
            width={'80%'}
            defaultLanguage="javascript"
            value={messageReceived}
            theme="vs-dark"
            options={{ fontSize: 20 }}
            onChange={(e) => {
              console.log("dsfa");
              console.log(e);

              setMessageRecieved(e);
              socket.emit("send-message", e);
            }}
          />
        </div>
      </div>

      <div>Active Users Connected: {users}</div>
    </div>
  );
}

export default App;
