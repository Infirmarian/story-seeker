import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFirebaseUser from "../../components/hooks/useFirebaseUser";
import { Firestore } from "../../components/Firebase";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import "./StoryEditor.css";
import { StoryNodeModel, StoryNodeFactory } from "./StoryNode";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel,
  DefaultNodeFactory,
  DefaultPortModel,
  DefaultPortFactory,
} from "@projectstorm/react-diagrams";
export default function StoryEditor() {
  //1) setup the diagram engine
  var engine = createEngine();
  engine.getNodeFactories().registerFactory(new StoryNodeFactory());
  //2) setup the diagram model
  var model = new DiagramModel();
  //3-A) create a default node
  var node1 = new StoryNodeModel();
  let port1 = node1.addInPort("In");

  //3-B) create another default node
  var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
  let port2 = node2.addInPort("In");
  node2.setPosition(400, 100);

  // link the ports
  // let link1 = port1.link<DefaultLinkModel>(port2);
  // link1.getOptions().testName = "Test";
  // link1.addLabel("Hello World!");

  //4) add the models to the root graph
  model.addAll(node1, node2);

  // model.deserializeModel(
  //   JSON.parse(
  //     '{"id":"562551fe-892f-49bd-a68f-003ba9b9f7b4","offsetX":0,"offsetY":0,"zoom":100,"gridSize":0,"layers":[{"id":"35231f26-6008-45cd-b75b-1b2e2203e602","type":"diagram-links","isSvg":true,"transformed":true,"models":{"3643ea2a-bf71-4e6e-897b-fa6f63633e8b":{"id":"3643ea2a-bf71-4e6e-897b-fa6f63633e8b","type":"default","source":"53119570-c332-4daf-b3ad-beb9339299b5","sourcePort":"aaddcf42-a90f-43c9-a7ec-aece18d20256","target":"f64a77c6-8779-4784-a392-bc4596d10609","targetPort":"bac75626-d4da-4f13-a1b8-8b27625f46ea","points":[{"id":"2f7ff6ba-a9fc-470a-a035-c8d1e6b46c2e","type":"point","x":147.234375,"y":133.5},{"id":"215af588-5eb6-49db-9d4a-5bb385e84cc2","type":"point","x":251.5,"y":356.5}],"labels":[{"id":"399d5e51-2e15-4820-9c7e-a52829e3f0fd","type":"default","offsetX":0,"offsetY":-23,"label":"Hello World!"}],"width":3,"color":"gray","curvyness":50,"selectedColor":"rgb(0,192,255)"}}},{"id":"04d6655a-1b20-48c9-863b-479442dc1736","type":"diagram-nodes","isSvg":false,"transformed":true,"models":{"53119570-c332-4daf-b3ad-beb9339299b5":{"id":"53119570-c332-4daf-b3ad-beb9339299b5","type":"default","x":100,"y":100,"ports":[{"id":"aaddcf42-a90f-43c9-a7ec-aece18d20256","type":"default","x":139.734375,"y":126,"name":"Out","alignment":"right","parentNode":"53119570-c332-4daf-b3ad-beb9339299b5","links":["3643ea2a-bf71-4e6e-897b-fa6f63633e8b"],"in":false,"label":"Out"}],"name":"Node 1","color":"rgb(0,192,255)","portsInOrder":[],"portsOutOrder":["aaddcf42-a90f-43c9-a7ec-aece18d20256"]},"f64a77c6-8779-4784-a392-bc4596d10609":{"id":"f64a77c6-8779-4784-a392-bc4596d10609","type":"default","selected":true,"x":242,"y":323,"ports":[{"id":"bac75626-d4da-4f13-a1b8-8b27625f46ea","type":"default","x":244,"y":349,"name":"In","alignment":"left","parentNode":"f64a77c6-8779-4784-a392-bc4596d10609","links":["3643ea2a-bf71-4e6e-897b-fa6f63633e8b"],"in":true,"label":"In"}],"name":"Node 2","color":"rgb(192,255,0)","portsInOrder":["bac75626-d4da-4f13-a1b8-8b27625f46ea"],"portsOutOrder":[]}}}]}'
  //   ),
  //   engine
  // );
  //5) load model into engine
  engine.setModel(model);

  //6) render the diagram!
  return (
    <div className="graph">
      <button
        onClick={() => {
          console.log(JSON.stringify(model.serialize()));
        }}
      >
        Save Me
      </button>
      <CanvasWidget engine={engine} className="graph" />
    </div>
  );
}
