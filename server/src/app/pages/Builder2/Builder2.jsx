import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Node from "./Node/Node";
import InputPort from "./Node/InputPort";
import Path from "./Node/Path";
import "./Node/Builder.css";
function Builder2() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState({ nodes: {} });
  const [links, setLinks] = useState({});
  useEffect(() => {
    console.log("Fetching story id...");
    const data = {
      nodes: {
        "1": {
          x: 0,
          y: 0,
          text: "Hello there",
          ports: [{ text: "Go left" }, { text: "Go right" }]
        },
        "2": {
          x: 300,
          y: 100,
          text: "Goodbye",
          ports: [{ text: "Hello" }]
        }
      },
      links: [{ to: 0, from: 1, fromPort: 0 }]
    };
    setNodes(data.nodes);
    setLinks(data.links);
  }, []);
  const addLink = (to, from, fromPort) => {
    setLinks({ ...links, "48": { to, from, fromPort } });
  };
  let p = [];
  for (const [k, v] of Object.entries(nodes)) {
    p.push(
      <Node id={k} key={k} x={v.x} y={v.y} text={v.text} ports={v.ports} />
    );
  }
  let l = [];
  for (const [k, v] of Object.entries(links)) {
    l.push(
      <Path x1={0} y1={0} x2={nodes[v.dest].x} y2={nodes[v.dest].y} key={k} />
    );
  }
  const paths = [];

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
        cancel=".drag, .node, .story-node"
        onStop={(e, ui) => {
          setOffset({ x: ui.x, y: ui.y });
        }}
        position={offset}
      >
        <div id="canvas">
          {p}
          {l}
          {paths}
        </div>
      </Draggable>
    </div>
  );
}

export default Builder2;
