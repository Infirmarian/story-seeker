import React from "react";

function InputPort() {
  return (
    <div
      onDragEnter={e => console.log(e.target)}
      style={{ color: "white", marginLeft: "200px" }}
    >
      Drop on me!
    </div>
  );
}

export default InputPort;
