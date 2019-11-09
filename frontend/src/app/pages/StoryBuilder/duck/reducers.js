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
	INITIALIZE_SELECTED_NODE,
	UPDATE_SELECTED_NODE,
	UPDATE_NODE_CONTENT,
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
const initialNodeContent = "You are walking down a dark path...";

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
		default:
			return state;
	}
};

export const selectedNode = (state = initialNode, action) => {
	switch (action.type) {
		case UPDATE_SELECTED_NODE:
			return action.payload.selectedNode;
		case UPDATE_NODE_CONTENT:
			// console.log(state);

			if (state != null) {
				// console.log(action.payload.text);
				state.setFullText(action.payload.text);
			}
			return state;
		default:
			return state;
	}
};

export const nodeContent = (state = initialNodeContent, action) => {
	switch (action.type) {
		case UPDATE_NODE_CONTENT:
			return action.payload.text;
		case UPDATE_SELECTED_NODE:
			return action.payload.selectedNode.getFullText();
		default:
			return state;
	}
};

export const reducer = reduceReducers(
	combineReducers({
		engine,
		model,
		selectedNode,
		nodeContent,
	}),
	(state, action) => {
		const { engine, model, selectedNode } = state;
		switch (action.type) {
			case INITIALIZE_SELECTED_NODE:
				const node = new StoryNode({
					text: initialNodeContent,
					beginning: true,
					engine,
				});
				node.setPosition(100, 100);
				node.addOutputPort("blue");
				node.addOutputPort("red");
				return {
					engine,
					model,
					selectedNode: node,
				};
			case INITIALIZE_MODEL:
				model.addAll(selectedNode);
				return {
					engine,
					model,
					selectedNode,
				};
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
