import React, { useState } from "react";

function InputPort(props) {
  const { nodeID } = props;
  const [className, setClassName] = useState("input-port");
  return (
    <div
      className={className}
      onDrop={e => {
        const id = e.dataTransfer.getData("node-id");
        if (id === nodeID) {
          console.log("Cannot drag to self!");
        }
        console.log(id);
        console.log(nodeID);
        setClassName("input-port");
      }}
      onDragOver={e => {
        setClassName("input-port-selected");
        e.preventDefault();
        return false;
      }}
      onDragLeave={() => setClassName("input-port")}
      style={{ color: "white", marginLeft: "200px" }}
    >
      Drop on me!
    </div>
  );
}

export default InputPort;
