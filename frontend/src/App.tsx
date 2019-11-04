
import React from 'react';
import Toolbar from './Toolbar';
import './App.css';
import './Main.css';
import createEngine, { 
  DefaultLinkModel, 
  DiagramModel 
} from '@projectstorm/react-diagrams';
import {StoryNode} from './StoryNode'
import {TSCustomNodeFactory} from './StoryNodeFactory'
import {
  CanvasWidget
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


class App extends React.Component{
  render(){
    // 1) setup the diagram engine
var engine = createEngine();
engine.getNodeFactories().registerFactory(new TSCustomNodeFactory());
// node 1
const node1 = new StoryNode({ color: 'rgb(0,192,255)', text: "You are walking down a dark path...", beginning: true });
node1.setPosition(100, 100);
const node2 = new StoryNode({ color: 'rgb(0,192,128)', text:"Goodbye!" });
node2.setPosition(200, 100);
//let port2 = node2.addInPort('In');
// link them and add a label to the link
const link1 = new DefaultLinkModel();
var p1 = node1.getPort('out');
if(p1)
  link1.setSourcePort(p1);
p1 = node2.getPort('in');
if(p1)
  link1.setTargetPort(p1);
const model = new DiagramModel();
model.addAll(node1, node2, link1);
engine.setModel(model);
      return (
    <div className="App">
      <CanvasWidget className='Graph' engine={engine}/>
      <Toolbar/>
    </div>
  );
}
}

export default App;
