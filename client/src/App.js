import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import axios from 'axios'
import qs from 'qs'
// import EditorComponent from "./EditorComponent";
import Editor from "@monaco-editor/react";
import Output from "./Output";

const socket = io.connect("http://localhost:3001");

function App() {
  const [data1, setData] = useState(null);

  const [code, setCode] = useState("");
  const [output,setOutput] = useState('');
  var data = qs.stringify({
    code: code,
    language: "cpp",
    input: "12",
  });
  var config = {
    method: "post",
    url: "https://api.codex.jaagrav.in",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  const [loading,setLoading] = useState('');

  const handleClick = async () => {
    console.log(code);
    setLoading('loading...');
    let a = await axios(config)
      .then(function (response) {
        console.log(response.data.output);
        setData(response.data.output);
        setOutput(response.data.output);
        setLoading('');
      })
      .catch(function (error) {
        console.log(error);
      });

  };
  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const [users, setUsers] = useState();

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setCode(code + data);
    });
  }, [socket]);
  socket.on("user-change", (data) => {
    setUsers(data);
  });

  socket.on("new-connection", (users) => {
    setCode(users);
  });

  const style = {
    background: "beige",
    width: "80%",
    display: "flex",
  };
  return (
    <div className="App container">
      <div style={style}>Your Personalised Code collaborator</div>

      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <Editor
            className="text-xl"
            height="85vh"
            width={"80%"}
            defaultLanguage="c++"
            value={code}
            theme="vs-dark"
            options={{ fontSize: 20 }}
            onChange={(e) => {
              console.log("dsfa");
              console.log(e);

              setCode(e);
              socket.emit("send-message", e);
            }}
          />
        </div>
      </div>

      <div>Active Users Connected: {users}</div>
      <button onClick={handleClick}>Click me</button>

      <div>Output</div>
      {loading}
      {output}
    </div>
  );
}

export default App;
