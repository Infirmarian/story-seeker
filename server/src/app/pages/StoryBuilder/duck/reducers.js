import createEngine, {
  DefaultLinkModel,
  DiagramModel,
  DiagramEngine,
  DefaultDiagramState,
  DefaultNodeModel
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
  INITIALIZE_MODEL,
  ADD_NODE_ON_DROP
} from "./actions";

// Redux
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";
import StoryModel from "../StoryModel";

const modelString = `{"zoom":90.38333333333338,"offsetX":25.868833333333207,"offsetY":22.306162247731233,"nodes":[{"x":0,"y":0,"id":"1ce35c28-3067-442a-9554-1254c36bb001","text":"Hi","question":"...","beginning":false,"end":false,"outputPortAnswers":[{"text":"FIRE RED","id":"6468971a-d99e-4ba9-addd-50cd668ec923"}]},{"x":263.322884012539,"y":96.25668449197856,"id":"3af3e36a-6d92-49bf-a6bf-8c5c3290f18e","text":"Goodbye","question":"...","beginning":false,"end":false,"outputPortAnswers":[{"text":"","id":"2ea72e8d-ce47-47dd-b570-db33863d0039"}]},{"x":90.55061773925883,"y":352.1495482205421,"id":"d3f1386a-8c2c-4a76-badf-b687df19cd3e","text":"Default","question":"...","beginning":false,"end":false,"outputPortAnswers":[]}],"links":[{"sourceID":"1ce35c28-3067-442a-9554-1254c36bb001","sourceIndex":0,"sink":"3af3e36a-6d92-49bf-a6bf-8c5c3290f18e"},{"sourceID":"3af3e36a-6d92-49bf-a6bf-8c5c3290f18e","sourceIndex":0,"sink":"d3f1386a-8c2c-4a76-badf-b687df19cd3e"}]}`;

const initialEngine = createEngine();
var initialModel = new StoryModel();
const initialNodeContent = "You are walking down a dark path...";
const initialNode = new StoryNode({
  text: initialNodeContent,
  beginning: true,
  engine: initialEngine
});

export const engine = (state = initialEngine, action) => {
  switch (action.type) {
    case SET_ENGINE_MODEL:
      state.setModel(action.payload.model);
      return state;
    case REGISTER_FACTORY:
      state.getNodeFactories().registerFactory(action.payload.nodeFactory);
      state.getPortFactories().registerFactory(action.payload.portFactory);
      state.getLinkFactories().registerFactory(action.payload.linkFactory);
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
        //id passed in through initializeModel()
        //This is the id matching with the URL parameter for a specific storybuilder page instance
        const id = action.payload.id;

        // MAKE FETCH REQUEST BASED ON ID for a JSON model string
        // dummy data modelString is currently declared on line 29
        console.log("Initializing model..." + id);
        if (id === -1) {
          //creates a default model
          model.addAll(selectedNode);
        } else {
          //creates a model by deserializing model string
          model.deserializeModel(JSON.parse(modelString), engine);
        }

        //selects arbitrary node as selected node
        //TODO: figure out which node is selected (might be part of deserialized model)
        const start = model.getNodes()[0];

        //keep this return as is. As long as you have deserialized some model using model.deserializeModel() then the correct data should load on the workspace
        return {
          engine,
          model,
          selectedNode: start
        };
      case ADD_NODE:
        var nodeToAdd = new StoryNode({
          text: "Default",
          engine: engine
        });
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
      case ADD_NODE_ON_DROP:
        var nodeToAdd = new StoryNode({
          text: "Default",
          engine: engine
        });
        nodeToAdd.setPosition(action.payload.point);
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
        const outputPorts = action.payload.node.getOutPorts();
        console.log(outputPorts);
        var newNode = null;
        if (outputPorts.length > 0) {
          if (action.payload.node.isBeginning) {
            console.log(outputPorts);
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
