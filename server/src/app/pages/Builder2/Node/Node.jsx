import React, { useState } from "react";
import Draggable from "react-draggable";
import Port from "./Port";

function Node(props) {
  console.log(props.props);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <Draggable
      onDrag={(e, ui) => {
        setPos({ x: ui.x, y: ui.y });
      }}
      cancel=".drag"
    >
      <div className="node">
        <Port />
      </div>
    </Draggable>
  );
}

export default Node;
