import {
  DefaultPortModel,
  DefaultLinkFactory,
  DefaultLinkModel,
} from "@projectstorm/react-diagrams";
import { AnswerPort } from "./CustomPorts";

export class CustomLinkModel extends DefaultLinkModel {
  constructor() {
    super({
      type: "custom-link",
      width: 2,
    });
  }

  deserialize(event: any) {
    super.deserialize(event);
    console.log("link deserialize", event);
    if (event.data.target) {
      event.getModel(event.data.targetPort).then((model: DefaultPortModel) => {
        this.setTargetPort(model);
      });
    }
    if (event.data.source) {
      console.log("setting source", event.data.source, event.data.sourcePort);
      event.getModel(event.data.sourcePort).then((model: AnswerPort) => {
        console.log(model);
        this.setSourcePort(model);
      });
    }
  }
}

export class CustomLinkFactory extends DefaultLinkFactory {
  constructor() {
    super("custom-link");
  }
  generateModel(): CustomLinkModel {
    return new CustomLinkModel();
  }
}
