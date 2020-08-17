import {
  DiagramModel,
  DefaultLinkModel,
  LinkModel,
} from "@projectstorm/react-diagrams";
import StoryNodeModel, { SerializedNode } from "./StoryNode/StoryNodeModel";
export interface SerializedModel {
  view: {
    x: number;
    y: number;
    zoom: number;
  };
  nodes: SerializedNode[];
  links: {
    sourceNode: string;
    sourcePort: string;
    targetNode: string;
  }[];
}
export default class StoryModel extends DiagramModel {
  save(): SerializedModel {
    const nodes = this.getNodes().map((n) => (n as StoryNodeModel).save());
    const links = this.getLinks().map((l) => ({
      sourceNode: l.getSourcePort().getNode().getID(),
      sourcePort: l.getSourcePort().getID(),
      targetNode: l.getTargetPort().getNode().getID(),
    }));
    console.log(links);
    return {
      view: {
        x: this.getOffsetX(),
        y: this.getOffsetY(),
        zoom: this.getZoomLevel(),
      },
      nodes,
      links,
    };
  }
  static load(story: SerializedModel): StoryModel {
    const model = new StoryModel();
    model.setOffsetX(story.view.x);
    model.setOffsetY(story.view.y);
    model.setZoomLevel(story.view.zoom);
    story.nodes.forEach((n) => model.addNode(StoryNodeModel.load(n)));
    story.links.forEach((l) => {
      const link = new DefaultLinkModel();
      const source = model.getNode(l.sourceNode) as StoryNodeModel;
      const outPort = source.getPort(l.sourcePort);
      if (outPort) link.setSourcePort(outPort);
      const dest = model.getNode(l.targetNode) as StoryNodeModel;
      const destPort = dest.getInPorts()[0];
      if (destPort) link.setTargetPort(destPort);
      model.addLink(link);
    });
    return model;
  }
}
