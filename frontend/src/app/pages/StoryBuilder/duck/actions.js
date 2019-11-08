// Action Types

// NODE ACTIONS
export const ADD_NODE = "ADD_NODE";
export const REMOVE_NODE = "REMOVE_NODE";
export const UPDATE_START_NODE = "UPDATE_START_NODE";
export const UPDATE_SELECTED_NODE = "UPDATE_SELECTED_NODE";

// ENGINE ACTIONS
export const SET_ENGINE_MODEL = "SET_ENGINE_MODEL";
export const REGISTER_FACTORY = "REGISTER_FACTORY";

// MODEL ACTIONS
export const INITIALIZE_MODEL = "INITIALIZE_MODEL";

// Action Creators
export const addNode = () => {
	console.log("adding");
	return {
		type: ADD_NODE,
		payload: {
			text: "Default",
		},
	};
};

export const removeNode = (node) => {
	return {
		type: REMOVE_NODE,
		payload: {
			node,
		},
	};
};

export const updateStartNode = (node) => {
	return {
		type: UPDATE_START_NODE,
		payload: {
			node,
		},
	};
};

export const updateSelectedNode = (node) => {
	return {
		type: UPDATE_SELECTED_NODE,
		payload: {
			selectedNode: node,
		},
	};
};

export const setEngineModel = (model) => {
	return {
		type: SET_ENGINE_MODEL,
		payload: {
			model,
		},
	};
};

export const registerFactory = (factory) => {
	return {
		type: REGISTER_FACTORY,
		payload: {
			factory,
		},
	};
};

export const initializeModel = () => {
	return {
		type: INITIALIZE_MODEL,
	};
};
