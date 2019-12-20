import React, { useEffect } from "react";

import {
  DiagramModel,
  DiagramEngine,
  DefaultDiagramState,
} from "@projectstorm/react-diagrams";
import { TSCustomNodeFactory } from "../StoryNodeFactory";
import { AnswerPortFactory, InputPortFactory } from "../CustomPortFactory";
import { StoryNode } from "../StoryNode";

import { CanvasWidget, InputType } from "@projectstorm/react-canvas-core";
import "./Workspace.css";
import { CustomLinkFactory } from "../CustomLinks";
import StoryModel from "../StoryModel";
import { URL } from "../../../../utils/constants";
interface WorkspaceProps {
  engine: DiagramEngine;
  model: DiagramModel;
  selectedNode: StoryNode;
}
function WorkspaceComponent(props: any) {
  const { engine, model, selectedNode } = props;
  const {
    updateSelectedNode,
    setEngineModel,
    registerFactory,
    initializeSelectedNode,
    initializeModel,
  } = props;
  console.log(engine, model, selectedNode);

  const { id } = props;
  useEffect(() => {
    initializeSelectedNode();
    registerFactory(
      [new TSCustomNodeFactory(updateSelectedNode)],
      [new AnswerPortFactory(), new InputPortFactory()],
      [new CustomLinkFactory()]
    );

    //this makes a call to line 96 of reducers.js
    //TODO: edit functionality to make a fetch request
    if (id > 0) {
      // initializeModel(id);
      fetch(URL + `/api/builder/${id}`).then((response) => {
        response.json().then((json) => {
          var newModel = new StoryModel();
          // console.log("json", json);
          newModel.deserializeModel(json, engine);
          newModel.storyID = id;
          setEngineModel(newModel);
          if (newModel.getNodes().length > 0) {
            updateSelectedNode(newModel.getNodes()[0]);
          }
          engine.repaintCanvas();
        });
      });
    } else {
      initializeModel(-1);
    }
  }, [
    initializeSelectedNode,
    initializeModel,
    registerFactory,
    updateSelectedNode,
  ]);

  const state = engine.getStateMachine().getCurrentState();
  if (state instanceof DefaultDiagramState) {
    console.log("Preventing loose links");
    state.dragNewLink.config.allowLooseLinks = false;
  }

  const actions = engine
    .getActionEventBus()
    .getActionsForType(InputType.KEY_DOWN);
  if (actions[0]) {
    engine.getActionEventBus().deregisterAction(actions[0]);
  }

  setEngineModel(model);

  return (
    <div>
      <CanvasWidget className="Graph" engine={engine} />
    </div>
  );
}

export default WorkspaceComponent;
