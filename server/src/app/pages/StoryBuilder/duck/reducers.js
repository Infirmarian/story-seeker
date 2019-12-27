import createEngine from "@projectstorm/react-diagrams";

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
  INITIALIZE_MODEL,
  ADD_NODE_ON_DROP,
} from "./actions";

// Redux
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";
import StoryModel from "../StoryModel";

const initialEngine = createEngine();
var initialModel = new StoryModel();
const initialNodeContent = "This is the beginning...";
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
      const { nodeFactories, portFactories, linkFactories } = action.payload;
      nodeFactories.forEach((factory) => {
        state.getNodeFactories().registerFactory(factory);
      });
      portFactories.forEach((factory) => {
        state.getPortFactories().registerFactory(factory);
      });
      linkFactories.forEach((factory) => {
        state.getLinkFactories().registerFactory(factory);
      });
      return state;
    default:
      return state;
  }
};

export const model = (state = initialModel, action) => {
  switch (action.type) {
    case SET_ENGINE_MODEL:
      return action.payload.model;
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
    var nodeToAdd;
    switch (action.type) {
      case INITIALIZE_SELECTED_NODE:
        // console.log("initial Node", selectedNode);

        selectedNode.setPosition(100, 100);
        if (selectedNode.getOutPorts().length === 0) {
          selectedNode.addOutputPort("choice 1");
          selectedNode.addOutputPort("choice 2");
        }
        return {
          engine,
          model,
          selectedNode,
        };
      case INITIALIZE_MODEL:
        //id passed in through initializeModel()
        const id = action.payload.id;

        // MAKE FETCH REQUEST BASED ON ID for a JSON model string
        if (id === -1) {
          //creates a default model
          model.addAll(selectedNode);
        }

        //selects arbitrary node as selected node
        const start = model.getNodes()[0];

        return {
          engine,
          model,
          selectedNode: start,
        };
      case ADD_NODE:
        nodeToAdd = new StoryNode({
          text: "",
          engine: engine,
        });
        var x = Math.floor(engine.getCanvas().clientWidth / 2);
        var y = Math.floor(engine.getCanvas().clientHeight / 2);
        nodeToAdd.setPosition(x, y);
        nodeToAdd.addOutputPort("");
        console.log(model.addNode(nodeToAdd));
        engine.repaintCanvas();
        return {
          engine,
          model,
          selectedNode,
        };
      case ADD_NODE_ON_DROP:
        nodeToAdd = new StoryNode({
          text: "",
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
        var nodeToRemove = action.payload.node;
        const inputPort = nodeToRemove.getInputPort();
        if (inputPort) {
          let incomingLinks = inputPort.getLinks();
          for (let link in incomingLinks) {
            incomingLinks[link].remove();
          }
        }
        const outputPorts = nodeToRemove.getOutPorts();
        // console.log(outputPorts);
        var newNode = null;
        if (outputPorts.length > 0) {
          if (nodeToRemove.isBeginning) {
            console.log(outputPorts);
            let outgoingLinks = outputPorts[0].getLinks();
            if (Object.keys(outgoingLinks).length > 0) {
              newNode = outgoingLinks[Object.keys(outgoingLinks)[0]]
                .getTargetPort()
                .getNode();
              newNode.setBeginning();
            }
          }
          outputPorts.forEach((port) => {
            let outgoingLinks = port.getLinks();
            for (let link in outgoingLinks) {
              outgoingLinks[link].remove();
            }
          });
        }
        model.removeNode(nodeToRemove);
        if (newNode == null) {
          newNode = model.getNodes()[0];
        }
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
