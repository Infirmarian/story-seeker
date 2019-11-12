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
      <div className="output-port" key={value.getID()}>
        <p className="port-answer">
          {value.answer.substring(0, 5) +
            `${value.answer.length > 5 ? "..." : ""}`}
        </p>
        <PortWidget engine={this.props.engine} port={value}>
          <div className="circle-port" />
        </PortWidget>
      </div>
    ));
    var input = this.props.node.getInputPort();
    let inelement;
    if (input) {
      inelement = (
        <PortWidget engine={this.props.engine} port={input} key={input.getID()}>
          <div className="circle-port" />
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
            "input-port-container" +
            `${this.props.node.isBeginning ? " input-port-start" : ""}`
          }
        >
          {inelement ? <div className="input-ports">{inelement}</div> : null}
          <p>{this.props.node.getShortText()}</p>
        </div>
        {question !== "" ? (
          <div className="output-port-container">
            <p className="question">
              {question.substring(0, 15) +
                `${question.length > 15 ? "..." : ""}`}
            </p>
            <div className="output-ports">{outputs}</div>
          </div>
        ) : null}
      </div>
    );
  }
}
