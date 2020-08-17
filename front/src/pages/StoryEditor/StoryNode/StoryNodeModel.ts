import {
  DefaultNodeModel,
  DiagramEngine,
  DiagramModel,
} from "@projectstorm/react-diagrams";
import OptionPortModel, {
  SerializedOptionPort,
} from "../StoryPort/OptionPortModel";
import { v4 } from "uuid";
import InputPortModel from "../StoryPort/InputPortModel";

export interface SerializedNode {
  text: string;
  terminal: boolean;
  question: string;
  id: string;
  root: boolean;
  position: {
    x: number;
    y: number;
  };
  output: SerializedOptionPort[];
}
export default class StoryNodeModel extends DefaultNodeModel {
  text: string = "";
  question: string = "";
  terminal: boolean = true;
  portsOut: OptionPortModel[] = [];
  constructor(id?: string) {
    super({
      type: "story",
      id: id || v4(),
    });
  }
  makeNonTerminal() {
    this.terminal = false;
    this.addPort(new OptionPortModel(v4()));
    this.addPort(new OptionPortModel(v4()));
  }
  makeTerminal() {
    this.terminal = true;
    [...this.getOutPorts()].forEach((p) => {
      Object.values(p.getLinks()).forEach((l) =>
        (this.getParentCanvasModel() as DiagramModel).removeLink(l)
      );
      this.removePort(p);
    });
  }
  addInputPort() {
    if (this.getPort("in")) throw new Error();
    this.addPort(new InputPortModel());
  }
  delete() {
    Object.values(this.getPorts()).forEach((p) =>
      Object.values(p.getLinks()).forEach((l) =>
        (this.getParentCanvasModel() as DiagramModel).removeLink(l)
      )
    );
    (this.getParentCanvasModel() as DiagramModel).removeNode(this);
  }
  save(): SerializedNode {
    return {
      id: this.getID(),
      text: this.text,
      terminal: this.terminal,
      question: this.question,
      root: this.portsIn.length === 0,
      position: {
        x: this.getX(),
        y: this.getY(),
      },
      output: this.portsOut.map((p) => p.save()),
    };
  }
  static load(serialized: SerializedNode) {
    const node = new StoryNodeModel(serialized.id);
    node.position.x = serialized.position.x;
    node.position.y = serialized.position.y;
    node.text = serialized.text;
    node.question = serialized.question;
    node.terminal = serialized.terminal;
    if (!serialized.root) node.addInputPort();
    serialized.output.forEach((o) => node.addPort(OptionPortModel.load(o)));
    return node;
  }
}
