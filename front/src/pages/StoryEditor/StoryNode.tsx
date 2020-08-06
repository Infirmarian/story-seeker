import React, { useEffect, useState } from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import {
  NodeModel,
  NodeModelGenerics,
  DefaultPortFactory,
  DefaultPortLabel,
  DefaultNodeModel,
} from "@projectstorm/react-diagrams";
import "./StoryNode.css";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";

export class StoryNodeModel extends DefaultNodeModel {
  start: boolean;
  text: string = "";
  constructor(start: boolean = false) {
    super({
      type: "story",
    });
    this.start = start;
  }
  setText(text: string) {
    this.text = text;
  }
}

export class StoryNodeFactory extends AbstractReactFactory<
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
export function StoryNodeWidget(props: {
  engine: DiagramEngine;
  node: StoryNodeModel;
}) {
  const { engine, node } = props;
  const [state, setState] = useState(node.text);
  return (
    <Card
      style={{ backgroundColor: props.node.isSelected() ? "red" : "white" }}
    >
      <div style={{ width: 20, height: 20, backgroundColor: "red" }}>
        <PortWidget engine={props.engine} port={props.node.getPorts()["In"]}>
          <div className="port" />
        </PortWidget>
      </div>
      <CardContent>
        <TextField
          placeholder="Dialog"
          multiline
          value={
            node.isSelected() ? props.node.text : props.node.text.substr(0, 40)
          }
          onChange={(e) => {
            node.setText(e.target.value);
            setState(node.text);
          }}
        />
      </CardContent>
      <Button
        onClick={() => {
          props.node.setText("Once upon a time,blah blah blah");
        }}
      >
        Click me
      </Button>
    </Card>
  );
}
