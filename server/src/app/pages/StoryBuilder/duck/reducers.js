import createEngine, {
  DiagramModel,
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
  SET_ENGINE_MODEL,
  REGISTER_FACTORY,
  INITIALIZE_MODEL
} from "./actions";

// Redux
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";

const initialEngine = createEngine();
var initialModel = new DiagramModel();
const initialNodeContent = "You are walking down a dark path...";
const initialNode = new StoryNode({
  text: initialNodeContent,
  beginning: true,
  engine: initialEngine
});

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
    default:
      return state;
  }
};

export const reducer = reduceReducers(
  combineReducers({
    engine,
    model,
    selectedNode
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
          selectedNode
        };
      case INITIALIZE_MODEL:
        /* var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
        node1.setPosition(100, 100);
        node1.addOutPort("port1", false);
        setTimeout(() => {
          node1.addOutPort("port2", false);
        }, 10000); */
        model.addAll(selectedNode);
        return {
          engine,
          model,
          selectedNode
        };
      case ADD_NODE:
        let nodeToAdd = new StoryNode({ text: "Default", engine: engine });
        var x = Math.floor(engine.getCanvas().clientWidth / 2);
        var y = Math.floor(engine.getCanvas().clientHeight / 2);
        nodeToAdd.setPosition(x, y);
        console.log(model.addNode(nodeToAdd));
        engine.repaintCanvas();
        return {
          engine,
          model,
          selectedNode
        };
      case REMOVE_NODE:
        if (model.getNodes().length <= 1) {
          return {
            engine,
            model,
            selectedNode
          };
        }
        const inputPort = action.payload.node.getInputPort();
        if (inputPort) {
          let incomingLinks = inputPort.getLinks();
          for (let link in incomingLinks) {
            incomingLinks[link].remove();
          }
        }
        const outputPorts = action.payload.node.getOutputPorts();
        var newNode = null;
        if (outputPorts) {
          if (action.payload.node.isBeginning) {
            let outgoingLinks = outputPorts[0].getLinks();
            if (outgoingLinks.length > 0) {
              newNode = outgoingLinks[Object.keys(outgoingLinks)[0]]
                .getTargetPort()
                .getNode();
            }
          }
          outputPorts.forEach(port => {
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
          selectedNode: newNode
        };
      case UPDATE_START_NODE:
        model.getNodes().forEach(element => {
          if (element.isBeginning) {
            element.clearBeginning();
          }
        });
        action.payload.node.setBeginning();
        engine.repaintCanvas();
        return {
          engine,
          model,
          selectedNode
        };
      default:
        return state;
    }
  }
);
