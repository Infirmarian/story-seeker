// Action Types

// NODE ACTIONS
export const ADD_NODE = "ADD_NODE";
export const ADD_NODE_ON_DROP = "ADD_NODE_ON_DROP";
export const REMOVE_NODE = "REMOVE_NODE";
export const UPDATE_START_NODE = "UPDATE_START_NODE";

export const INITIALIZE_SELECTED_NODE = "INITIALIZED_SELECTED_NODE";
export const UPDATE_SELECTED_NODE = "UPDATE_SELECTED_NODE";

// ENGINE ACTIONS
export const SET_ENGINE_MODEL = "SET_ENGINE_MODEL";
export const REGISTER_FACTORY = "REGISTER_FACTORY";

// MODEL ACTIONS
export const INITIALIZE_MODEL = "INITIALIZE_MODEL";

// Action Creators
export const addNode = () => {
	return {
		type: ADD_NODE,
		payload: {
			text: "Default",
		},
	};
};

export const addNodeOnDrop = (point) => {
	return {
		type: ADD_NODE_ON_DROP,
		payload: {
			point,
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

export const registerFactory = (nodeFactory, portFactory, linkFactory) => {
	return {
		type: REGISTER_FACTORY,
		payload: {
			nodeFactory,
			portFactory,
			linkFactory,
		},
	};
};

export const initializeModel = (id = -1) => {
	return {
		type: INITIALIZE_MODEL,
		payload: { id },
	};
};

export const initializeSelectedNode = () => {
	return {
		type: INITIALIZE_SELECTED_NODE,
	};
};
