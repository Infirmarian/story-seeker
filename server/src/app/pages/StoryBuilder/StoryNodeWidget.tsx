import * as React from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { StoryNode } from "./StoryNode";
import "./StoryNodeWidget.css";

export interface TSCustomNodeWidgetProps {
  node: StoryNode;
  engine: DiagramEngine;
  callback: (node: StoryNode) => void;
}

export interface TSCustomNodeWidgetState {
  callback: (node: StoryNode) => void;
}

const MAX_TEXT_LENGTH = 30;
export class TSCustomNodeWidget extends React.Component<
  TSCustomNodeWidgetProps,
  TSCustomNodeWidgetState
> {
  constructor(props: TSCustomNodeWidgetProps) {
    super(props);
    this.state = { callback: props.callback };
  }

  render() {
    const question = this.props.node.getQuestion();
    var outputPorts = this.props.node.getOutputPorts();
    const outputs = outputPorts.map(value => (
      <div className="output-port-wrapper" key={value.getID()}>
        <p className="port-answer node-text">
          {value.answer.substring(0, 2) +
            `${value.answer.length > 2 ? "..." : ""}`}
        </p>
        <PortWidget engine={this.props.engine} port={value}>
          <div className="port output-port" />
        </PortWidget>
      </div>
    ));
    var input = this.props.node.getInputPort();
    let inelement;
    if (input) {
      inelement = (
        <PortWidget engine={this.props.engine} port={input} key={input.getID()}>
          <div className="port" />
        </PortWidget>
      );
    } else {
      inelement = null;
    }
    return (
      <div
        className={
          this.props.node.isBeginning
            ? "story-node-start story-node"
            : "story-node"
        }
        onClick={() => this.state.callback(this.props.node)}
      >
        <div
          className={
            "node-header" +
            `${this.props.node.isBeginning ? " start-node-header" : ""}`
          }
        >
          {inelement ? (
            <div className="input-port-container">{inelement}</div>
          ) : null}
          <p className="node-text">{this.props.node.getShortText()}</p>
        </div>
        {question !== "" ? (
          <div className="node-footer">
            <p className="question node-text">
              {question.substring(0, 15) +
                `${question.length > 15 ? "..." : ""}`}
            </p>
            <div className="output-port-container">{outputs}</div>
          </div>
        ) : null}
      </div>
    );
  }
}
