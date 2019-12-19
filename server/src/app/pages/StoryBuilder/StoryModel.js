import {
  DiagramModel,
  LinkModel,
  DefaultLinkModel,
} from "@projectstorm/react-diagrams";
import { StoryNode } from "./StoryNode";

class StoryModel extends DiagramModel {
  storyID;
  serialize() {
    let result = {
      zoom: this.getZoomLevel(),
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      nodes: [],
      links: [],
    };
    this.getNodes().forEach((e) => {
      result.nodes.push(e.serializeNode());
    });
    this.getLinks().forEach((l) => {
      result.links.push({
        sourceID: l
          .getSourcePort()
          .getNode()
          .getID(),
        sourceIndex: l
          .getSourcePort()
          .getNode()
          .getPortIndex(l.getSourcePort().getID()),
        sink: l
          .getTargetPort()
          .getNode()
          .getID(),
      });
    });
    console.log(result);
    return JSON.stringify(result);
  }

  deserializeModel(obj, engine) {
    console.log(obj);
    this.setZoomLevel(obj.zoom);
    this.setOffsetX(obj.offsetX);
    this.setOffsetY(obj.offsetY);
    let nodes = {};
    obj.nodes.forEach((e) => {
      let n = new StoryNode({ text: "", beginning: e.beginning, engine });
      n.deserializeNode(e);
      nodes[n.getID()] = n;
      this.addNode(n);
    });
    obj.links.forEach((l) => {
      let ln = new DefaultLinkModel();
      let sink = nodes[l.sink].getInputPort();
      console.log("sink", sink);
      ln.setTargetPort(sink);
      let source = nodes[l.sourceID].getOutPorts()[l.sourceIndex];
      if (source) {
        ln.setSourcePort(source);
        this.addLink(ln);
      }
    });
  }
}

export default StoryModel;
