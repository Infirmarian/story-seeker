import {
  NodeModel,
  DiagramEngine,
  DefaultLinkModel,
  DefaultPortModel,
  DefaultNodeModel,
  PortModel
} from "@projectstorm/react-diagrams";
import { AnswerPort, InputPort } from "./CustomPorts";
import { BaseModelOptions } from "@projectstorm/react-canvas-core";
const uuid = require("uuid/v4");
export interface StoryNodeOptions extends BaseModelOptions {
  text: string;
  beginning?: boolean;
  id?: string;
  engine: DiagramEngine;
}
const MAX_TEXT_LENGTH = 50;
const MAX_QUESTION_LENGTH = 15;

export class StoryNode extends DefaultNodeModel {
  text: string;
  question: string;
  isBeginning: boolean;
  isEnd: boolean;
  engine: DiagramEngine;
  id?: string;

  constructor(options: StoryNodeOptions) {
    super({
      type: "ts-custom-node"
    });
    this.text = options.text;
    this.question = "...";
    this.isBeginning = options.beginning || false;
    this.isEnd = false;
    this.engine = options.engine;
    this.id = options.id;

    if (!this.isBeginning) {
      // this.addInPort("in");
      this.addInputPort("in");
    }
  }

  getID(): string {
    return this.id || super.getID();
  }

  getPortIndex(targetID: string): number {
    let count = 0;
    for (const e of this.getOutPorts()) {
      if (e.getID() === targetID) {
        return count;
      }
      count++;
    }
    return -1;
  }
  // Add custom attributes to serialization process
  serializeNode() {
    return {
      x: this.position.x,
      y: this.position.y,
      id: this.getID(),
      text: this.text,
      question: this.question,
      beginning: this.isBeginning,
      end: this.isEnd,
      outputPortAnswers: this.portsOut.map(port => {
        let answerPort = port as AnswerPort;
        return { text: answerPort.answer, id: answerPort.getID() };
      })
    };
  }

  deserializeNode(e: any) {
    console.log(e.x);
    const { x, y, id, text, question, beginning, end, outputPortAnswers } = e;
    this.setPosition(x, y);
    this.id = id;
    this.text = text;
    this.question = question;
    this.isBeginning = beginning;
    this.isEnd = end;
    outputPortAnswers.forEach((e: any) => {
      this.addOutputPort(e.text);
    });
  }

  updateNode(): void {
    let tempPort = this.addInPort("temp");
    this.removePort(tempPort);
    this.engine.repaintCanvas();
  }
  getShortText(): string {
    return (
      this.text.substring(0, MAX_TEXT_LENGTH) +
      (this.text.length > MAX_TEXT_LENGTH ? "..." : "")
    );
  }
  getFullText(): string {
    return this.text;
  }
  setFullText(nt: string): void {
    this.text = nt;
    this.engine.repaintCanvas();
  }
  getQuestion(): string {
    return this.question;
  }
  setQuestion(q: string): void {
    this.question = q;
    this.engine.repaintCanvas();
  }
  setEnd(): void {
    this.setQuestion("");
    this.getOutPorts().forEach((port) => {
      this.removeOutputPort(port.getOptions().id);
    });
    this.isEnd = true;
  }
  resetEnd(): void {
    this.isEnd = false;
    this.setQuestion("...");
  }
  addOutputPort(option: string): any {
    console.log("Adding output port");
    if (this.getOutPorts().length >= 3) return false;
    const addedPort = new AnswerPort({
      answer: option,
      engine: this.engine,
      in: false,
      name: String(uuid()),
      label: String(uuid())
    });
    this.addPort(addedPort);
    // var addedPort = this.addOutPort(option);
    this.engine.repaintCanvas();
    return addedPort.getOptions().id;
  }
  removePort(port: DefaultPortModel): void {
    if (port.getOptions().in) {
      this.portsIn.splice(this.portsIn.indexOf(port));
    } else {
      console.log(this.portsOut);
      this.portsOut.splice(this.portsOut.indexOf(port), 1);
    }
    setTimeout(() => {
      if (port && port.getName() in this.ports)
        delete this.ports[port.getName()];
    }, 1);
    // console.log("final", this.getPorts());
  }
  removeOutputPort(portID: any): boolean {
    var portToRemove = this.getPortFromID(portID);
    console.log(portToRemove);
    if (portToRemove instanceof AnswerPort) {
      var links = portToRemove.getLinks();
      for (let link in links) {
        links[link].remove();
      }
      console.log("before", this.getPorts(), this.getOutPorts());
      this.removePort(portToRemove);
      console.log("after", this.getPorts(), this.getOutPorts());
      this.engine.repaintCanvas();
      return true;
    }
    return false;
  }
  updateOutputPort(portID: any, message: string): boolean {
    var portToUpdate = this.getPortFromID(portID);
    if (portToUpdate instanceof AnswerPort) {
      // console.log("node", message);
      portToUpdate.setAnswer(message);
      return true;
    }
    return false;
  }
  addInputPort(option: string): any {
    if (this.getInPorts().length === 0) {
      const inputPort = new InputPort({
        in: true,
        name: option,
        label: option,
      });

      this.addPort(inputPort);
      this.engine.repaintCanvas();
      return inputPort.getOptions().id;
    }
    return false;
  }
  getInputPort(): DefaultPortModel | InputPort | null {
    return this.getInPorts()[0];
  }
  setBeginning(): void {
    var inputPort = this.getInputPort();
    if (inputPort) {
      var incomingLinks = [];
      for (var v in inputPort.getLinks()) {
        incomingLinks.push(inputPort.getLinks()[v]);
      }
      incomingLinks.forEach(element => {
        element.remove();
      });
      this.removePort(inputPort);
      inputPort = null;
    }
    this.isBeginning = true;
    this.isEnd = false;
  }
  clearBeginning(): void {
    // this.addInPort("in");
    this.addInputPort("in");
    this.isBeginning = false;
  }
}
