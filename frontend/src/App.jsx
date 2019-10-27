import React from 'react';
import './App.css';
import {Graph} from 'react-d3-graph';
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

const myConfig = {
  nodeHighlightBehavior: true,
  node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
      labelProperty: getContent,
  },
  link: {
      highlightColor: "lightblue",
  },
  automaticRearrangeAfterDropNode: false,
  directed: true,
  staticGraphWithDragAndDrop: true
};

function getContent(index){
  return story_data.steps[index.id].content;
}

function addNodeTool(){
  console.log("Adding a node");
  //TODO: Create a way to click and add new nodes to the graph
  // this should switch the tool to add nodes to the graph
}
function addEdgeTool(){
  console.log("Adding an edge");
  //TODO: Create a way to make an edge between two nodes
  // this should switch the tool to create edges between nodes
}
function submitGraphData(){
  // TODO: Send the story_data to the server (once the server is set up)
  fetch(SERVER_URL);
}

function onClickNode(nodeId){
  // TODO: Either create a textbox where text for the
  // story data for the given node can be edited or make the
  // text box pop up when it is hovered over
    window.alert(`Clicked node ${nodeId}`);
}

class App extends React.Component{
  render(){
      return (
    <div className="App">
      <button onClick={addNodeTool}/>
      <button onClick={addEdgeTool}/>
      <buton onClick={submitGraphData}/>
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={graph_data}
        config={myConfig}
        onClickNode={onClickNode}
//        onMouseOverNode={compileGraph}
//        onMouseOutNode={compileGraph}
        />
    </div>
  );
}
}

export default App;
