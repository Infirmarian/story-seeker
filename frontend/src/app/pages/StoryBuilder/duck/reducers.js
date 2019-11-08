import createEngine, {
	DefaultLinkModel,
	DiagramModel,
	DiagramEngine,
	DefaultDiagramState,
} from "@projectstorm/react-diagrams";

// Object Types
import { StoryNode } from "../StoryNode";

//Action Types
import {
	ADD_NODE,
	REMOVE_NODE,
	UPDATE_START_NODE,
	UPDATE_SELECTED_NODE,
	SET_ENGINE_MODEL,
	REGISTER_FACTORY,
	INITIALIZE_MODEL,
} from "./actions";

// Redux
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";

const initialEngine = createEngine();
var initialModel = new DiagramModel();
const initialNode = null;

export const engine = (state = initialEngine, action) => {
	switch (action.type) {
		case SET_ENGINE_MODEL:
			console.log("model", action.payload);
			state.setModel(action.payload.model);
			return state;
		case REGISTER_FACTORY:
			console.log("factory", action.payload);
			state.getNodeFactories().registerFactory(action.payload.factory);
			return state;
		default:
			return state;
	}
};

export const model = (state = initialModel, action) => {
	switch (action.type) {
		case INITIALIZE_MODEL:
			const node1 = new StoryNode({
				text: "You are walking down a dark path...",
				beginning: true,
				engine,
			});
			node1.setPosition(100, 100);
			node1.addOutputPort("blue");
			node1.addOutputPort("red");
			state.addAll(node1);
			return state;
		default:
			return state;
	}
};

export const selectedNode = (state = initialNode, action) => {
	switch (action.type) {
		case UPDATE_SELECTED_NODE:
			return action.payload.selectedNode;
		default:
			return state;
	}
};

export const reducer = reduceReducers(
	combineReducers({
		engine,
		model,
		selectedNode,
	}),
	(state, action) => {
		const { engine, model, selectedNode } = state;
		switch (action.type) {
			case ADD_NODE:
				console.log(
					model.addNode(
						new StoryNode({ text: "Default", engine: engine })
					)
				);
				engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode,
				};
			case REMOVE_NODE:
				model.removeNode(action.payload.node);
				engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode,
				};
			case UPDATE_START_NODE:
				model.getNodes().forEach((element) => {
					if (element.isBeginning) {
						element.clearBeginning();
					}
				});
				action.payload.node.setBeginning();
				engine.repaintCanvas();
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
