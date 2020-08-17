import { DefaultPortModel } from "@projectstorm/react-diagrams";
export interface SerializedOptionPort {
  text: string;
  id: string;
}
export default class InputPortModel extends DefaultPortModel {
  constructor() {
    super({ in: true, name: "in", label: "in" });
    this.setMaximumLinks(0);
    this.setLocked(true);
  }
  canLinkToPort(port: DefaultPortModel): boolean {
    return (
      false &&
      super.canLinkToPort(port) &&
      this.getNode() !== port.getNode() &&
      Object.values(this.getLinks()).every((e) => e.getTargetPort() !== port)
    );
  }
}
