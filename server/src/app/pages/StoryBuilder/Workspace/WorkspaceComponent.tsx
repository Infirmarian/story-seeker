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
      [new AnswerPortFactory()],
      [new CustomLinkFactory()]
    );

    //this makes a call to line 96 of reducers.js
    //TODO: edit functionality to make a fetch request
    if (id > 0) {
      initializeModel(id);
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

  // registerFactory(new TSCustomNodeFactory(updateSelectedNode));

  setEngineModel(model);
  // useEffect(() => {
  // 	var newModel = new DiagramModel();
  // 	newModel.deserializeModel(JSON.parse(modelString), engine);
  // 	setEngineModel(newModel);
  // 	console.log("new model set");
  // }, [setEngineModel]);

  return (
    <div>
      <CanvasWidget className="Graph" engine={engine} />
    </div>
  );
}

export default WorkspaceComponent;
