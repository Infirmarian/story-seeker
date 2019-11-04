
import React from 'react';
import './App.css';
import createEngine, { 
  DefaultLinkModel, 
  DefaultNodeModel,
  DiagramModel 
} from '@projectstorm/react-diagrams';
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
// node 1
const node1 = new DefaultNodeModel({
	name: 'Node 1',
	color: 'rgb(0,192,255)',
});
node1.setPosition(100, 100);
let port1 = node1.addOutPort('Out');
node1.addOutPort('Path 2');

// node 2
const node2 = new DefaultNodeModel({
	name: 'Node 2',
	color: 'rgb(0,192,128)',
});
node2.setPosition(100, 200);
let port2 = node2.addInPort('In');
// link them and add a label to the link
const link = port1.link<DefaultLinkModel>(port2);
link.addLabel('Hello World!')
const model = new DiagramModel();
model.addAll(node1, node2, link);
engine.setModel(model);
      return (
    <div className="App">
      <CanvasWidget className='Graph' engine={engine}/>
    </div>
  );
}
}

export default App;
