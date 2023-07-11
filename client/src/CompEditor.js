import React from "react";
import Editor from "@monaco-editor/react";

const CompEditor = () => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      value="this"
    />
  );
};

export default CompEditor;
