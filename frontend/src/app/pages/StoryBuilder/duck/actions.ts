// Action Types
export const ADD_NODE = "ADD_NODE";
export const REMOVE_NODE = "REMOVE_NODE";
export const UPDATE_START_NODE = "UPDATE_START_NODE";
export const UPDATE_SELECTED_NODE = "UPDATE_SELECTED_NODE";

// Object Types
import { StoryNode } from "../StoryNode";

// Action Creators
export const addNode = () => {
	return {
		type: ADD_NODE,
		payload: {
			text: "Default",
		},
	};
};

export const removeNode = (node: StoryNode) => {
	return {
		type: REMOVE_NODE,
		payload: {
			node,
		},
	};
};

export const updateStartNode = (node: StoryNode) => {
	return {
		type: UPDATE_START_NODE,
		payload: {
			node,
		},
	};
};

export const updateSelectedNode = (node: StoryNode) => {
	return {
		type: UPDATE_SELECTED_NODE,
		payload: {
			selectedNode: node,
		},
	};
};
