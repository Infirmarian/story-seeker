import React, { useState } from "react";
import Draggable from "react-draggable";
import Port from "./Port";
import InputPort from "./InputPort";

function Node(props) {
  const [pos, setPos] = useState({ x: props.x, y: props.y });
  const ports = props.ports.map(n => {
    return <Port text={n.text} nodeID={props.id} />;
  });
  return (
    <Draggable
      onDrag={(e, ui) => {
        setPos({ x: ui.x, y: ui.y });
      }}
      position={pos}
      cancel=".drag"
    >
      <div className="story-node">
        <InputPort nodeID={props.id} />
        <p className="node-text">{props.text}</p>
        {ports}
      </div>
    </Draggable>
  );
}

export default Node;
