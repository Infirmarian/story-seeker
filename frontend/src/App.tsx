
import React from 'react';
import Toolbar from './Toolbar';
import './App.css';
import './Main.css';
import createEngine, { 
  DefaultLinkModel, 
  DiagramModel, 
  DiagramEngine,
  DefaultDiagramState
} from '@projectstorm/react-diagrams';
import {StoryNode} from './StoryNode'
import {TSCustomNodeFactory} from './StoryNodeFactory'
import {
  CanvasWidget, InputType
} from '@projectstorm/react-canvas-core';
const SERVER_URL = 'http://need_to_actually_set_this_up.com/graph/submit'
var story_data = {
  title: "Hello world!",
  steps:[
    {content: "Once upon a time, this is a really long textbox, does it properly fit within the field of a graph node?? I don't think so :("},
    {content: "You died"},
    {content: "You died (worse...)"}
  ]
}

var graph_data = {
    nodes: [{ id: 0, }, { id: 1 }, { id: 2 }],
    links: [{ source: 0, target: 1 }, { source: 0, target: 2 }],
};

interface AppState{
  engine: DiagramEngine,
  model: DiagramModel,
  selectedNode: StoryNode
}

class App extends React.Component<{}, AppState>{
  constructor(props: any){
    super(props);
    const engine = createEngine();
    const model = new DiagramModel();
    const state = engine.getStateMachine().getCurrentState();
    if (state instanceof DefaultDiagramState) {
      console.log('Preventing loose links');
      state.dragNewLink.config.allowLooseLinks = false;
    }
    this.updateSelectedNode = this.updateSelectedNode.bind(this);
    this.addNode = this.addNode.bind(this);
    this.compressModelToJson = this.compressModelToJson.bind(this);
    this.updateStartingNode = this.updateStartingNode.bind(this);
    // Shitty workaround to prevent deleting nodes
    const actions = engine
        .getActionEventBus()
        .getActionsForType(InputType.KEY_DOWN);
    engine.getActionEventBus().deregisterAction(actions[0]);
//    engine.getActionEventBus().registerAction(); TODO: Register a delete edge event

    engine.getNodeFactories().registerFactory(new TSCustomNodeFactory(this.updateSelectedNode));
    const node1 = new StoryNode({ text: "You are walking down a dark path...", beginning: true });
    node1.setPosition(100, 100);
    node1.addOutputPort('blue');
    node1.addOutputPort('red');
    const node2 = new StoryNode({text:"Goodbye!" });
    node2.setPosition(200, 100);
    const link1 = new DefaultLinkModel();
    var p1 = node1.getPort('out');
    if(p1)
      link1.setSourcePort(p1);
    p1 = node2.getPort('in');
    if(p1)
      link1.setTargetPort(p1);
    model.addAll(node1, node2, link1);
    engine.setModel(model);

    this.state = {
      selectedNode: props.node,
      engine: engine,
      model: model
    }
  }
  updateSelectedNode(node: StoryNode){
    this.setState(
      {selectedNode: node}
   );
  }
  addNode(){
    console.log('Adding Node from App.tsx');
    const Node1 = new StoryNode({text: 'Default'});
    this.state.model.addNode(Node1);
    this.forceUpdate();
  }
  compressModelToJson(): string{
    const model = this.state.model;
    const nodes = model.getNodes();
    let result = {}
    nodes.forEach(element => {
      const question = element as StoryNode;
      question.getOutputPorts().forEach(port =>{
        const links = port.getLinks();
        if(Object.keys(links).length !== 1){
          console.log('Too many outputs on a port');
        }
      })
    });
    return JSON.stringify(result);
  }
  updateStartingNode(ns: StoryNode){
    this.state.model.getNodes().forEach(element => {
      if((element as StoryNode).isBeginning) {
        (element as StoryNode).clearBeginning();
      }
    })
    ns.setBeginning();
  }
  render(){
    const {selectedNode} = this.state;
      return (
    <div className="App">
      <CanvasWidget className='Graph' engine={this.state.engine}/>
      <Toolbar node={selectedNode} addNodeFunc={this.addNode} setBeginning={this.updateStartingNode}/>
    </div>
  );
}
}

export default App;
