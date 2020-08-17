import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
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
import StoryModel, { SerializedModel } from "./StoryModel";
import { Button } from "@material-ui/core";
import { v4 } from "uuid";
export default function StoryEditor() {
  const { id } = useParams();
  const user = useFirebaseUser();
  const history = useHistory();
  const [state, setState] = useState({
    loading: true,
    story: generateBaseStory(),
  });

  useEffect(() => {
    if (user)
      Firestore()
        .collection("stories")
        .doc(id)
        .get()
        .then((doc) => {
          const data = doc.data();
          if (!data) {
            history.push("/404");
            return;
          }
          if (!data.story) {
            data.story = generateBaseStory();
          } else {
            data.story = JSON.parse(data.story);
          }
          setState((s) => ({ ...s, loading: false, story: data.story }));
        });
  }, [user]);
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new StoryNodeFactory());
  //   JSON.parse(
  //     '{"view":{"x":0,"y":0,"zoom":100},"nodes":[{"id":"d72dc50a-1b66-4f20-bb11-03f437c63bc0","text":"","terminal":false,"question":"","root":false,"position":{"x":400,"y":240},"output":[{"text":"Foo bar!","id":"f41eccf3-1966-4010-be35-4bbb20ee9f7a"},{"text":"baz","id":"d1d45fac-3dc7-4421-a7c5-ce51a817d432"}]},{"id":"9c638903-920b-4e5e-a79e-1799d4440a6c","text":"","terminal":false,"question":"","root":false,"position":{"x":40,"y":220},"output":[{"text":"Fab","id":"4d18b795-acd0-4ec7-8dd5-c1ad7e2a9c85"},{"text":"","id":"8b885b2a-ab3c-4246-8a81-5556d0167afe"}]},{"id":"55ecdb05-206b-4a35-aee2-877b554f1666","text":"","terminal":true,"question":"","root":false,"position":{"x":280,"y":20},"output":[]}],"links":[{"sourceNode":"9c638903-920b-4e5e-a79e-1799d4440a6c","sourcePort":"4d18b795-acd0-4ec7-8dd5-c1ad7e2a9c85","targetNode":"d72dc50a-1b66-4f20-bb11-03f437c63bc0"}]}'
  //   )
  // );
  const engineState = engine.getStateMachine().getCurrentState();
  if (engineState instanceof DefaultDiagramState) {
    engineState.dragNewLink.config.allowLooseLinks = false;
  }
  const actions = engine
    .getActionEventBus()
    .getActionsForType(InputType.KEY_DOWN);
  if (actions[0]) {
    engine.getActionEventBus().deregisterAction(actions[0]);
  }
  const model = StoryModel.load(state.story);
  model.setGridSize(20);
  engine.setModel(model);

  return (
    <>
      <Navbar />
      <Button
        onClick={() => {
          model.clearSelection();
          engine.zoomToFitNodes();
        }}
      >
        Fit!
      </Button>
      <button
        onClick={() => {
          Firestore()
            .collection("stories")
            .doc(id)
            .update({ story: JSON.stringify(model.save()) })
            .then(() => console.log("Saved to firebase!"));
          console.log(JSON.stringify(model.save()));
        }}
      >
        Save Me
      </button>
      {state.loading ? (
        <Spinner />
      ) : (
        <div className="graph-box">
          <CanvasWidget engine={engine} className="graph" />
        </div>
      )}
    </>
  );
}

function generateBaseStory(): SerializedModel {
  return {
    view: { x: 0, y: 0, zoom: 100 },
    links: [],
    nodes: [
      {
        id: v4(),
        text: "This is a prompt that will be read to the listener",
        question: "This question will be asked",
        root: true,
        terminal: false,
        position: { x: 40, y: 40 },
        output: [
          { text: "This is a choice", id: v4() },
          { text: "This is a second choice", id: v4() },
        ],
      },
    ],
  };
}
