import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFirebaseUser from "../../components/hooks/useFirebaseUser";
import { Firestore } from "../../components/Firebase";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import "./StoryEditor.css";
import StoryNodeFactory from "./StoryNode/StoryNode";
import { CanvasWidget, InputType } from "@projectstorm/react-canvas-core";
import createEngine, {
  DefaultDiagramState,
  DefaultPortModel,
} from "@projectstorm/react-diagrams";
import StoryModel from "./StoryModel";
import StoryNodeModel from "./StoryNode/StoryNodeModel";
export default function StoryEditor() {
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new StoryNodeFactory());

  // const model = new StoryModel();

  const model = StoryModel.load(
    JSON.parse(
      '{"view":{"x":0,"y":0,"zoom":100},"nodes":[{"id":"d72dc50a-1b66-4f20-bb11-03f437c63bc0","text":"","terminal":false,"question":"","root":false,"position":{"x":259,"y":300},"output":[{"text":"","id":"963b90a3-087e-4f7b-b53e-1c5bfe4980e9"},{"text":"","id":"a5c53400-f65b-4e48-b5b5-9886eb329bb4"}],"input":[{"id":"d812fb81-ec2f-442c-839e-ee15df38a56d"}]},{"id":"9c638903-920b-4e5e-a79e-1799d4440a6c","text":"","terminal":false,"question":"","root":false,"position":{"x":-2,"y":222},"output":[{"text":"","id":"96422711-26aa-492b-b620-6bbeb611c882"},{"text":"","id":"84dfd084-b615-4385-a327-7e172a337d37"}],"input":[{"id":"b36016d7-b541-4a0f-b3ce-b706d573cd27"}]}],"links":[{"sourceNode":"9c638903-920b-4e5e-a79e-1799d4440a6c","sourcePort":"96422711-26aa-492b-b620-6bbeb611c882","targetNode":"d72dc50a-1b66-4f20-bb11-03f437c63bc0"},{"sourceNode":"9c638903-920b-4e5e-a79e-1799d4440a6c","sourcePort":"84dfd084-b615-4385-a327-7e172a337d37","targetNode":"d72dc50a-1b66-4f20-bb11-03f437c63bc0"}]}'
    )
  );
  var node1 = new StoryNodeModel();
  node1.addPort(new DefaultPortModel(true, "In"));
  node1.setPosition(50, 50);
  model.addAll(node1);

  engine.setModel(model);
  const state = engine.getStateMachine().getCurrentState();
  if (state instanceof DefaultDiagramState) {
    state.dragNewLink.config.allowLooseLinks = false;
  }
  const actions = engine
    .getActionEventBus()
    .getActionsForType(InputType.KEY_DOWN);
  if (actions[0]) {
    engine.getActionEventBus().deregisterAction(actions[0]);
  }
  //6) render the diagram!
  return (
    <>
      <Navbar />
      <div className="graph">
        <CanvasWidget engine={engine} className="graph" />
        <button
          onClick={() => {
            console.log(JSON.stringify(model.save()));
          }}
        >
          Save Me
        </button>
      </div>
    </>
  );
}
