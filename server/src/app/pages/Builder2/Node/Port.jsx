import React, { useState } from "react";

function Port(props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [originalPos, setOriginalPos] = useState({ x: 0, y: 0 });
  return (
    <div className="port">
      <div
        className="drag"
        draggable
        onDragStart={e => {
          setOriginalPos({ x: e.pageX, y: e.pageY });
        }}
        onDrag={e => {
          if (
            (pos.x !== e.pageX - originalPos.x ||
              pos.y !== e.pageY - originalPos.y) &&
            e.pageX !== 0
          ) {
            setPos({ x: e.pageX - originalPos.x, y: e.pageY - originalPos.y });
          }
        }}
        onDragEnd={e => {
          console.log(pos);
        }}
      />
      <svg>
        <path
          d={`M 0 0 ${pos.x} ${pos.y}`}
          stroke="blue"
          strokeWidth="5"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default Port;
