import createEngine, {
	DefaultLinkModel,
	DiagramModel,
	DiagramEngine,
	DefaultDiagramState,
	DefaultNodeModel,
} from "@projectstorm/react-diagrams";

// Object Types
import { StoryNode } from "../StoryNode";

//Action Types
import {
	ADD_NODE,
	ADD_NODE_ON_DROP,
	REMOVE_NODE,
	UPDATE_START_NODE,
	INITIALIZE_SELECTED_NODE,
	UPDATE_SELECTED_NODE,
	SET_ENGINE_MODEL,
	REGISTER_FACTORY,
	INITIALIZE_MODEL,
} from "./actions";

// Redux
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";

const modelString = `{"id":"d0a88b9f-b08c-43c3-9d08-f58a27b08810","offsetX":0,"offsetY":0,"zoom":100,"gridSize":0,"layers":[{"id":"5c21890e-4518-4733-a9ae-5610822f291d","type":"diagram-links","isSvg":true,"transformed":true,"models":{"64d375f0-efe0-4dad-aa7d-30ebf8686847":{"id":"64d375f0-efe0-4dad-aa7d-30ebf8686847","type":"default","selected":false,"source":"351ac14d-1142-4bea-983c-2df0b6781921","sourcePort":"88be9262-54ed-4cf7-a318-8b8c3140d5bd","target":"c8053ed2-c9a4-40df-a7b4-bac9b2623a6f","targetPort":"50b1be96-a6ab-465c-aa00-5b9aebaa8676","points":[{"id":"0b334623-dbfd-4990-8564-b16511443a61","type":"point","x":506.875,"y":210.5},{"id":"d891ca0e-8ce7-47e5-9789-10330c8a10ad","type":"point","x":258.5,"y":372.5}],"labels":[],"width":3,"color":"gray","curvyness":50,"selectedColor":"rgb(0,192,255)"},"c4312a45-8bbe-46c6-a5e1-47c926a91a8c":{"id":"c4312a45-8bbe-46c6-a5e1-47c926a91a8c","type":"default","selected":false,"source":"351ac14d-1142-4bea-983c-2df0b6781921","sourcePort":"09de36fd-6a59-46bf-be64-27691ef70d95","target":"6b096c75-ef68-4dce-a0bc-20eeba81f938","targetPort":"0843745d-e19a-437a-a538-395929226219","points":[{"id":"e0fc89ff-e586-4d92-9407-d55b1b5237e2","type":"point","x":506.875,"y":226.5},{"id":"25fddd5a-bae9-48f8-80c0-f071b74fbf3c","type":"point","x":590.5,"y":323.5}],"labels":[],"width":3,"color":"gray","curvyness":50,"selectedColor":"rgb(0,192,255)"},"b9b39317-b6af-4fa6-b8d1-91a68891bbab":{"id":"b9b39317-b6af-4fa6-b8d1-91a68891bbab","type":"default","selected":false,"source":"c8053ed2-c9a4-40df-a7b4-bac9b2623a6f","sourcePort":"fcd1c96d-c37d-42db-aef3-454d16db576a","target":"ae7f3614-4c9f-48bb-9f17-7b99bb5e04c2","targetPort":"b26e5c17-c627-4d87-90aa-25c14fb7316f","points":[{"id":"68da9b98-b8dd-4e43-9d03-508e63ad8b00","type":"point","x":306.875,"y":417.5},{"id":"49b11a12-55ee-495d-97aa-b74c849ae293","type":"point","x":248.5,"y":526.5}],"labels":[],"width":3,"color":"gray","curvyness":50,"selectedColor":"rgb(0,192,255)"},"73edb968-d8fb-4943-b7b0-2ca8f61c4845":{"id":"73edb968-d8fb-4943-b7b0-2ca8f61c4845","type":"default","selected":false,"source":"6b096c75-ef68-4dce-a0bc-20eeba81f938","sourcePort":"36f146ce-b733-4d02-bfd8-195c95ee753b","target":"852e3e90-1bc0-4375-8398-fd7f1bad655d","targetPort":"94099dd4-b612-4a71-a6b4-576907380379","points":[{"id":"17ba7d87-bcda-4ab1-92d8-823760e264ad","type":"point","x":638.875,"y":368.5},{"id":"e86c2536-78e9-4e69-9659-0f79b4b0ae85","type":"point","x":742.5,"y":500.5}],"labels":[],"width":3,"color":"gray","curvyness":50,"selectedColor":"rgb(0,192,255)"}}},{"id":"c350b3d2-ec61-4154-a199-1544291aea94","type":"diagram-nodes","isSvg":false,"transformed":true,"models":{"351ac14d-1142-4bea-983c-2df0b6781921":{"id":"351ac14d-1142-4bea-983c-2df0b6781921","type":"ts-custom-node","selected":true,"x":393,"y":179,"ports":[{"id":"88be9262-54ed-4cf7-a318-8b8c3140d5bd","type":"default","x":492.75,"y":203,"name":"deb65334-6634-4c5f-9fd0-1cb3635d83a3","alignment":"right","parentNode":"351ac14d-1142-4bea-983c-2df0b6781921","links":["64d375f0-efe0-4dad-aa7d-30ebf8686847"],"in":false,"label":"7053e2cf-6c3a-481a-98b7-5a49f8863e02","answer":"option 1"},{"id":"09de36fd-6a59-46bf-be64-27691ef70d95","type":"default","x":492.75,"y":219,"name":"7975535c-3a8e-451a-883f-a8442ef76e89","alignment":"right","parentNode":"351ac14d-1142-4bea-983c-2df0b6781921","links":["c4312a45-8bbe-46c6-a5e1-47c926a91a8c"],"in":false,"label":"a3b0a9b0-5cb4-4471-ae02-d658fa2f9974","answer":"option 2"}],"name":"Untitled","color":"rgb(0,192,255)","portsInOrder":[],"portsOutOrder":["88be9262-54ed-4cf7-a318-8b8c3140d5bd","09de36fd-6a59-46bf-be64-27691ef70d95"],"text":"This is a sample story","question":"Sample Question 1","beginning":true,"end":false,"outputPortAnswers":["option 1","option 2"]},"852e3e90-1bc0-4375-8398-fd7f1bad655d":{"id":"852e3e90-1bc0-4375-8398-fd7f1bad655d","type":"ts-custom-node","selected":false,"x":677,"y":487,"ports":[{"id":"94099dd4-b612-4a71-a6b4-576907380379","type":"default","x":680,"y":493,"name":"8ed344b6-c512-496f-89d8-d2a563d29ac5","alignment":"left","parentNode":"852e3e90-1bc0-4375-8398-fd7f1bad655d","links":["73edb968-d8fb-4943-b7b0-2ca8f61c4845"],"in":true,"label":"8ed344b6-c512-496f-89d8-d2a563d29ac5"}],"name":"Untitled","color":"rgb(0,192,255)","portsInOrder":["94099dd4-b612-4a71-a6b4-576907380379"],"portsOutOrder":[],"text":"Final 2","question":"","beginning":false,"end":true,"outputPortAnswers":[]},"6b096c75-ef68-4dce-a0bc-20eeba81f938":{"id":"6b096c75-ef68-4dce-a0bc-20eeba81f938","type":"ts-custom-node","selected":false,"x":525,"y":310,"ports":[{"id":"0843745d-e19a-437a-a538-395929226219","type":"default","x":528,"y":316,"name":"6b5ca4a4-acd0-4a8d-b0c6-bbd46e89198f","alignment":"left","parentNode":"6b096c75-ef68-4dce-a0bc-20eeba81f938","links":["c4312a45-8bbe-46c6-a5e1-47c926a91a8c"],"in":true,"label":"6b5ca4a4-acd0-4a8d-b0c6-bbd46e89198f"},{"id":"36f146ce-b733-4d02-bfd8-195c95ee753b","type":"default","x":624.75,"y":361,"name":"876472c3-96a6-4f63-9f79-6ec890c2fb69","alignment":"right","parentNode":"6b096c75-ef68-4dce-a0bc-20eeba81f938","links":["73edb968-d8fb-4943-b7b0-2ca8f61c4845"],"in":false,"label":"9c049e30-bb00-4bd3-905a-f19a148670fd","answer":"final option"}],"name":"Untitled","color":"rgb(0,192,255)","portsInOrder":["0843745d-e19a-437a-a538-395929226219"],"portsOutOrder":["36f146ce-b733-4d02-bfd8-195c95ee753b"],"text":"Path for option 2","question":"Option 2 Question","beginning":false,"end":false,"outputPortAnswers":["final option"]},"ae7f3614-4c9f-48bb-9f17-7b99bb5e04c2":{"id":"ae7f3614-4c9f-48bb-9f17-7b99bb5e04c2","type":"ts-custom-node","selected":false,"x":183,"y":513,"ports":[{"id":"b26e5c17-c627-4d87-90aa-25c14fb7316f","type":"default","x":186,"y":519,"name":"ba7dc83f-0440-4308-a389-10af73eeb6d6","alignment":"left","parentNode":"ae7f3614-4c9f-48bb-9f17-7b99bb5e04c2","links":["b9b39317-b6af-4fa6-b8d1-91a68891bbab"],"in":true,"label":"ba7dc83f-0440-4308-a389-10af73eeb6d6"}],"name":"Untitled","color":"rgb(0,192,255)","portsInOrder":["b26e5c17-c627-4d87-90aa-25c14fb7316f"],"portsOutOrder":[],"text":"Final 1","question":"","beginning":false,"end":true,"outputPortAnswers":[]},"c8053ed2-c9a4-40df-a7b4-bac9b2623a6f":{"id":"c8053ed2-c9a4-40df-a7b4-bac9b2623a6f","type":"ts-custom-node","selected":false,"x":193,"y":359,"ports":[{"id":"50b1be96-a6ab-465c-aa00-5b9aebaa8676","type":"default","x":196,"y":365,"name":"bad505a9-150f-474d-b45e-a0323ad1937f","alignment":"left","parentNode":"c8053ed2-c9a4-40df-a7b4-bac9b2623a6f","links":["64d375f0-efe0-4dad-aa7d-30ebf8686847"],"in":true,"label":"bad505a9-150f-474d-b45e-a0323ad1937f"},{"id":"fcd1c96d-c37d-42db-aef3-454d16db576a","type":"default","x":292.75,"y":410,"name":"66d44b13-0a37-4826-9c7a-596499cb971f","alignment":"right","parentNode":"c8053ed2-c9a4-40df-a7b4-bac9b2623a6f","links":["b9b39317-b6af-4fa6-b8d1-91a68891bbab"],"in":false,"label":"06afc398-9c5c-4e12-b944-b4223767f3a4","answer":"final option"}],"name":"Untitled","color":"rgb(0,192,255)","portsInOrder":["50b1be96-a6ab-465c-aa00-5b9aebaa8676"],"portsOutOrder":["fcd1c96d-c37d-42db-aef3-454d16db576a"],"text":"Path for option 1","question":"Option 1 Question","beginning":false,"end":false,"outputPortAnswers":["final option"]}}}]}`;

const initialEngine = createEngine();
var initialModel = new DiagramModel();
const initialNodeContent = "You are walking down a dark path...";
const initialNode = new StoryNode({
	text: initialNodeContent,
	beginning: true,
	engine: initialEngine,
});

export const engine = (state = initialEngine, action) => {
	switch (action.type) {
		case SET_ENGINE_MODEL:
			state.setModel(action.payload.model);
			return state;
		case REGISTER_FACTORY:
			state
				.getNodeFactories()
				.registerFactory(action.payload.nodeFactory);
			state
				.getPortFactories()
				.registerFactory(action.payload.portFactory);
			state
				.getLinkFactories()
				.registerFactory(action.payload.linkFactory);
			console.log(state.getPortFactories());
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
			case INITIALIZE_SELECTED_NODE:
				selectedNode.setPosition(100, 100);
				selectedNode.addOutputPort("blue");
				selectedNode.addOutputPort("red");
				return {
					engine,
					model,
					selectedNode,
				};
			case INITIALIZE_MODEL:
				const id = action.payload.id;

				// MAKE FETCH REQUEST BASED ON ID
				if (id == -1) {
					model.addAll(selectedNode);
				} else {
					model.deserializeModel(JSON.parse(modelString), engine);
				}
				const start = model.getNodes()[0];
				return {
					engine,
					model,
					selectedNode: start,
				};
			case ADD_NODE:
				var nodeToAdd = new StoryNode({
					text: "Default",
					engine: engine,
				});
				var x = Math.floor(engine.getCanvas().clientWidth / 2);
				var y = Math.floor(engine.getCanvas().clientHeight / 2);
				nodeToAdd.setPosition(x, y);
				console.log(model.addNode(nodeToAdd));
				engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode,
				};
			case ADD_NODE_ON_DROP:
				var nodeToAdd = new StoryNode({
					text: "Default",
					engine: engine,
				});
				nodeToAdd.setPosition(action.payload.point);
				console.log(model.addNode(nodeToAdd));
				engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode,
				};
			case REMOVE_NODE:
				if (model.getNodes().length <= 1) {
					return {
						engine,
						model,
						selectedNode,
					};
				}
				const inputPort = action.payload.node.getInputPort();
				if (inputPort) {
					let incomingLinks = inputPort.getLinks();
					for (let link in incomingLinks) {
						incomingLinks[link].remove();
					}
				}
				const outputPorts = action.payload.node.getOutPorts();
				console.log(outputPorts);
				var newNode = null;
				if (outputPorts.length > 0) {
					if (action.payload.node.isBeginning) {
						console.log(outputPorts);
						let outgoingLinks = outputPorts[0].getLinks();
						if (outgoingLinks.length > 0) {
							newNode = outgoingLinks[
								Object.keys(outgoingLinks)[0]
							]
								.getTargetPort()
								.getNode();
						}
					}
					outputPorts.forEach((port) => {
						let outgoingLinks = port.getLinks();
						for (let link in outgoingLinks) {
							outgoingLinks[link].remove();
						}
					});
				}
				model.removeNode(action.payload.node);
				if (newNode == null) {
					newNode = model.getNodes()[0];
				}
				newNode.setBeginning();
				engine.repaintCanvas();
				return {
					engine,
					model,
					selectedNode: newNode,
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
