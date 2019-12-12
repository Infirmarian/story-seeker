import React from "react";

function Path(props) {
  return (
    <svg>
      <path
        d={`M ${props.x1} ${props.y1} ${props.x2} ${props.y2}`}
        stroke="blue"
        strokeWidth="5"
        fill="none"
      />
    </svg>
  );
}
export default Path;
