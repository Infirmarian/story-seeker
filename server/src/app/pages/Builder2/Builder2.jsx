import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Node from "./Node/Node";
import InputPort from "./Node/InputPort";
import Path from "./Node/Path";
function Builder2() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [data, setData] = useState({ nodes: [], links: [] });
  useEffect(() => {
    console.log("Fetching story id...");
    setData({
      nodes: [
        { x: 0, y: 0, id: 1, text: "Hello there" },
        { x: 0, y: 100, id: 2, text: "Goodbye" }
      ],
      links: [{ source: 0, sourcePort: 0, dest: 1 }]
    });
  }, []);
  const p = data.nodes.map(n => <Node key={n.id} props={n} />);
  const l = data.links.map(n => {
    return (
      <Path x1={0} y1={0} x2={data.nodes[n.dest].x} y2={data.nodes[n.dest].y} />
    );
  });
  return (
    <div
      id="background"
      style={{
        height: "80vh",
        width: "80vw",
        position: "relative",
        overflow: "auto",
        padding: "0",
        backgroundColor: "gray"
      }}
    >
      <button
        className="btn btn-primary"
        onClick={() => {
          setOffset({ x: 0, y: 0 });
          console.log("Resetting position");
        }}
      >
        Reset position
      </button>
      <InputPort />
      <Draggable
        cancel=".drag, .node"
        onStop={(e, ui) => {
          setOffset({ x: ui.x, y: ui.y });
        }}
        position={offset}
      >
        <div id="canvas">
          {p}
          {l}
        </div>
      </Draggable>
    </div>
  );
}

export default Builder2;
