import React, { useState } from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams";
import { TextField } from "@material-ui/core";
import "./OptionPort.css";
import OptionPortModel from "./OptionPortModel";

export function OptionPortWidget(props: {
  engine: DiagramEngine;
  port: OptionPortModel;
  optional: boolean;
  number: number;
}) {
  const { engine, port, optional, number } = props;
  const [text, setText] = useState(port.text);
  return (
    <div className="option-port">
      {optional ? (
        <button
          className="delete-option"
          onClick={() => {
            port.getNode().removePort(port);
            engine.repaintCanvas();
          }}
        >
          x
        </button>
      ) : null}
      <div className={`out-text ${optional ? "ml0" : ""}`}>
        <TextField
          value={text}
          label={`Option ${number}`}
          InputLabelProps={{ style: { fontSize: 10 } }}
          InputProps={{ style: { fontSize: 10, marginTop: 10, padding: 0 } }}
          onChange={(e) => {
            const value = e.target.value.replace(/[\r\n\v]+/g, "");
            port.text = value;
            setText(value);
          }}
        />
      </div>
      <div className="out-port">
        <PortWidget engine={engine} port={port}>
          <div className="port-img" />
        </PortWidget>
      </div>
    </div>
  );
}