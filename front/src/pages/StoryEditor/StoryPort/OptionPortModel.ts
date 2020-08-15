import { DefaultPortModel } from "@projectstorm/react-diagrams";
import { v4 } from "uuid";
export interface SerializedOptionPort {
  text: string;
  id: string;
}
export default class OptionPortModel extends DefaultPortModel {
  text: string = "";
  constructor(id: string, text?: string) {
    super({ in: false, name: id, label: id });
    this.setMaximumLinks(1);
    this.text = text || "";
  }
  save(): SerializedOptionPort {
    return {
      text: this.text,
      id: this.getID(),
    };
  }
  static load(blob: SerializedOptionPort) {
    const port = new OptionPortModel(blob.id, blob.text);
    return port;
  }
}
