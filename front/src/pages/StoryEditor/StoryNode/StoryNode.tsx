import React, { useEffect, useState } from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { DefaultNodeModel } from "@projectstorm/react-diagrams";
import "./StoryNode.css";
import "../StoryPort/OptionPort.css";
import { Card, TextField, Button } from "@material-ui/core";
import StoryNodeModel from "./StoryNodeModel";
import { OptionPortWidget } from "../StoryPort/OptionPort";
import OptionPortModel from "../StoryPort/OptionPortModel";

export default class StoryNodeFactory extends AbstractReactFactory<
  StoryNodeModel,
  DiagramEngine
> {
  constructor() {
    super("story");
  }

  generateReactWidget(event: { model: StoryNodeModel }): JSX.Element {
    return <StoryNodeWidget engine={this.engine} node={event.model} />;
  }

  generateModel(event: any) {
    return new StoryNodeModel();
  }
}

function StoryNodeWidget(props: {
  engine: DiagramEngine;
  node: StoryNodeModel;
}) {
  const { engine, node } = props;
  const [state, setState] = useState({
    text: node.text,
    question: node.question,
  });
  return (
    <Card
      style={{
        borderStyle: props.node.isSelected() ? "solid" : "hidden",
        borderWidth: 3,
        borderColor: "white",
        margin: props.node.isSelected() ? 0 : 3,
        overflow: "visible",
      }}
    >
      <button
        className="delete-button"
        onClick={() => {
          if (
            window.confirm("Are you sure you want to delete part of the story?")
          ) {
            engine.getModel().removeNode(node);
            engine.repaintCanvas();
          }
        }}
      >
        x
      </button>
      {node.root ? null : (
        <div className="out-port">
          <PortWidget engine={engine} port={node.getPorts()["In"]}>
            <div className="port-img" />
          </PortWidget>
        </div>
      )}
      <TextField
        placeholder="Dialog"
        multiline
        InputProps={{ style: { fontSize: 10 } }}
        value={
          node.isSelected() ? props.node.text : props.node.text.substr(0, 40)
        }
        onChange={(e) => {
          const text = e.target.value.replace(/[\r\n\v]+/g, "");
          node.setText(text);
          setState({ ...state, text });
        }}
      />
      {node.terminal ? (
        <Button
          onClick={() => {
            node.makeNonTerminal();
            engine.repaintCanvas();
          }}
        >
          Add Options
        </Button>
      ) : (
        <>
          <Button
            onClick={() => {
              node.makeTerminal();
              engine.repaintCanvas();
            }}
          >
            X
          </Button>
          <div>
            <TextField
              placeholder="Question"
              InputProps={{ style: { fontSize: 10 } }}
              value={node.question}
              onChange={(e) => {
                const question = e.target.value.replace(/[\r\n\v]+/g, "");
                node.question = question;
                setState({ ...state, question });
              }}
            />
          </div>
          {node.getOutPorts().map((p, i) => {
            return (
              <OptionPortWidget
                key={p.getID()}
                engine={engine}
                port={p as OptionPortModel}
                optional={i === 2}
              />
            );
          })}
          {node.isSelected() && node.getOutPorts().length < 3 ? (
            <Button
              variant="contained"
              onClick={() => {
                node.addPort(new OptionPortModel("foo"));
                engine.repaintCanvas();
              }}
              style={{ margin: 5 }}
            >
              Add Path
            </Button>
          ) : null}
        </>
      )}
    </Card>
  );
}
