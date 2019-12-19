import * as React from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { StoryNode } from "./StoryNode";
import { AnswerPort } from "./CustomPorts";
import "./StoryNodeWidget.css";

export interface TSCustomNodeWidgetProps {
  node: StoryNode;
  engine: DiagramEngine;
  callback: (node: StoryNode) => void;
}

export interface TSCustomNodeWidgetState {
  callback: (node: StoryNode) => void;
}

export class TSCustomNodeWidget extends React.Component<
  TSCustomNodeWidgetProps,
  TSCustomNodeWidgetState
> {
  constructor(props: TSCustomNodeWidgetProps) {
    super(props);
    this.state = { callback: props.callback };
  }

  render() {
    const question = this.props.node.getShortQuestion();
    const text = this.props.node.getShortText();
    const isBeginning = this.props.node.isBeginning;
    var outputPorts = this.props.node.getOutPorts();
    const outputs = outputPorts.map((port) => {
      const ansPort = port as AnswerPort;
      return (
        <div className="output-port-wrapper" key={ansPort.getID()}>
          <p className="port-answer node-text">
            {ansPort.answer
              ? ansPort.answer.substring(0, 2) +
                `${ansPort.answer.length > 2 ? "..." : ""}`
              : ""}
          </p>
          <PortWidget engine={this.props.engine} port={ansPort}>
            <div className="port output-port" />
          </PortWidget>
        </div>
      );
    });
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
        className={isBeginning ? "story-node-start story-node" : "story-node"}
        onClick={() => this.state.callback(this.props.node)}
      >
        <div
          className={
            "node-header" + `${isBeginning ? " start-node-header" : ""}`
          }
        >
          {inelement ? (
            <div className="input-port-container">{inelement}</div>
          ) : null}
          <p className="node-text">
            {text === "" ? "Create your story..." : text}
          </p>
        </div>
        {question !== undefined ? (
          <div className="node-footer">
            <p className="node-question node-text">
              {question === "" ? "...?" : question}
            </p>
            <div className="output-port-container">{outputs}</div>
          </div>
        ) : null}
      </div>
    );
  }
}
