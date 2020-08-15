import { DefaultNodeModel } from "@projectstorm/react-diagrams";
import OptionPortModel, {
  SerializedOptionPort,
} from "../StoryPort/OptionPortModel";
import { v4 } from "uuid";

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
  input: any;
}
export default class StoryNodeModel extends DefaultNodeModel {
  text: string = "";
  question: string = "";
  root: boolean = false;
  terminal: boolean = true;
  portsOut: OptionPortModel[] = [];
  constructor(id?: string) {
    super({
      type: "story",
      id: id || v4(),
    });
  }
  setText(text: string) {
    this.text = text;
  }

  makeNonTerminal() {
    this.terminal = false;
    this.addPort(new OptionPortModel(v4()));
    this.addPort(new OptionPortModel(v4()));
  }
  makeTerminal() {
    this.terminal = true;
    [...this.getOutPorts()].forEach((p) => {
      this.removePort(p);
    });
  }
  save(): SerializedNode {
    return {
      id: this.getID(),
      text: this.text,
      terminal: this.terminal,
      question: this.question,
      root: this.root,
      position: {
        x: this.getX(),
        y: this.getY(),
      },
      output: this.portsOut.map((p) => p.save()),
      input: this.portsIn.map((p) => ({
        id: p.getID(),
      })),
    };
  }
  static load(serialized: SerializedNode) {
    const node = new StoryNodeModel(serialized.id);
    node.position.x = serialized.position.x;
    node.position.y = serialized.position.y;
    node.root = serialized.root;
    node.text = serialized.text;
    node.question = serialized.question;
    node.terminal = serialized.terminal;
    if (!node.root) node.addInPort("In");
    serialized.output.forEach((o) => node.addPort(OptionPortModel.load(o)));
    return node;
  }
}
