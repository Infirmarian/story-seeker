import createEngine, {
	DefaultLinkModel,
	DiagramModel,
	DiagramEngine,
	DefaultDiagramState,
} from "@projectstorm/react-diagrams";
import { StoryNode } from "./StoryNode";
import { TSCustomNodeFactory } from "./StoryNodeFactory";
import { CanvasWidget, InputType } from "@projectstorm/react-canvas-core";

// Object Types
import { StoryNode } from "../StoryNode";

//Action Types
import {
	ADD_NODE,
	REMOVE_NODE,
	UPDATE_START_NODE,
	UPDATE_SELECTED_NODE,
} from "./actions";

// Redux
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";

const initialEngine = createEngine();
const initialModel = new DiagramModel();
const initialNode = null;

export const engine = (state = initialEngine, action) => {
	return state;
};

export const model = (state = initialModel, action) => {
	return state;
};

export const selectedNode = (state = initialNode, action) => {
	switch (action.type) {
		case UPDATE_SELECTED_NODE:
			return action.payload.selectedNode;
	}
};

export const reducer = reduceReducers(
	combineReducers({
		engine,
		model,
		selectedNode,
	}),
	(state, action) => {
		switch (action.type) {
			case ADD_NODE:
				state.model.addNode(
					new StoryNode({ text: "", engine: state.engine })
				);
				state.engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode,
				};
			case REMOVE_NODE:
				state.model.removeNode(action.payload.node);
				state.engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode,
				};
			case UPDATE_START_NODE:
				state.model.getNodes().forEach((element) => {
					if (element.isBeginning) {
						element.clearBeginning();
					}
				});
				action.payload.node.setBeginning();
				state.engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode,
				};
			default:
				return state;
		}
	}
);
