import React, { useEffect } from "react";

import {
	DiagramModel,
	DiagramEngine,
	DefaultDiagramState,
} from "@projectstorm/react-diagrams";
import { TSCustomNodeFactory } from "../StoryNodeFactory";
import { StoryNode } from "../StoryNode";

import { CanvasWidget, InputType } from "@projectstorm/react-canvas-core";
import "./Workspace.css";

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

	useEffect(() => {
		initializeSelectedNode();
		initializeModel();
		registerFactory(new TSCustomNodeFactory(updateSelectedNode));
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

	return (
		<div>
			<CanvasWidget className="Graph" engine={engine} />
		</div>
	);
}

export default WorkspaceComponent;
