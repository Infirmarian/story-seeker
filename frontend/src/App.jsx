import React from 'react';
import './App.css';
import {Graph} from 'react-d3-graph';

var story_data = {
  title: "Hello world!",
  steps:[
    {content: "Once upon a time, this is a really long textbox, does it properly fit within the field of a graph node?? I don't think so :("},
    {content: "You died"},
    {content: "You died (worse...)"}
  ]
}
function getContent(index){
  return story_data.steps[index.id].content;
}
var graph_data = {
    nodes: [{ id: 0, }, { id: 1 }, { id: 2 }],
    links: [{ source: 0, target: 1 }, { source: 0, target: 2 }],
};

function compileGraph(){

};

const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: "lightgreen",
        size: 120,
        highlightStrokeColor: "blue",
        labelProperty: getContent
    },
    link: {
        highlightColor: "lightblue",
    },
    automaticRearrangeAfterDropNode: false,
    directed: true
};

function onClickNode(nodeId){
    window.alert(`Clicked node ${nodeId}`);
}
function App() {
  return (
    <div className="App">
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={graph_data}
        config={myConfig}
        onClickNode={onClickNode}
/*        onRightClickNode={onRightClickNode}
        onClickGraph={onClickGraph}
        onClickLink={onClickLink}
        onRightClickLink={onRightClickLink}
        onMouseOverNode={onMouseOverNode}
        onMouseOutNode={onMouseOutNode}
        onMouseOverLink={onMouseOverLink}
        onMouseOutLink={onMouseOutLink}
        onNodePositionChange={onNodePositionChange}*/
        />
    </div>
  );
}

export default App;
