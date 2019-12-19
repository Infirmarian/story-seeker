import React from "react";
import { Link, useHistory } from "react-router-dom";
import { StoryNode } from "../StoryNode";
import "./Toolbar.css";
import { DefaultPortModel } from "@projectstorm/react-diagrams";
import { URL } from "../../../../utils/constants";
// import { Link } from "react-router-dom";

interface ToolbarProps {
  node: StoryNode;
  addNode: () => void;
  removeNode: (node: StoryNode) => void;
  updateStartNode: (node: StoryNode) => void;
}

function ToolbarComponent(props: any) {
  const { engine, model, addNode, addNodeOnDrop } = props;
  let history = useHistory();
  /* const convertModelToJSON = () => {
    var result: { content: Array<any>; title: string } = {
      content: Array(model.getNodes().length),
      title: "title",
    };
    var mapping: { [index: string]: number } = {};
    var counter = 1;
    const nodes = model.getNodes();
    nodes.forEach((node: StoryNode) => {
      const id = node.getID(); // .getOptions().id;
      if (node.isBeginning) {
        mapping[id] = 0;
      } else {
        mapping[id] = counter;
        counter += 1;
      }
    });
    nodes.forEach((node: StoryNode) => {
      const main = node.text;
      const question = node.question;
      var options: Array<Array<any>> = [];
      node.getOutPorts().forEach((port: DefaultPortModel) => {
        const links = port.getLinks();
        for (var link in links) {
          const linkedNode =
            mapping[
              links[link]
                .getTargetPort()
                .getNode()
                .getID()
            ];
          options.push([port.getOptions().label, linkedNode]);
        }
      });
      if (options.length > 0)
        result.content[mapping[node.getID()]] = {
          main,
          question,
          options,
        };
      else result.content[mapping[node.getID()]] = { main };
    });
    return JSON.stringify(result);
  }; */

  const handleSubmit = () => {
    fetch(URL + `/api/builder/${model.storyID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model.serialize()),
    })
      .then(() => {
        window.alert("Saved Story");
      })
      .catch((error) => {
        console.warn(error);
        window.alert("Failed to Save!");
      });
  };

  const handleDropToAdd = (event: any) => {
    var point = engine.getRelativeMousePoint(event);
    console.log(point);
    addNodeOnDrop(point);
  };

  return (
    <div className="Toolbar">
      <span
        id="Add-Btn"
        className="toolbar-btn"
        onClick={() => addNode()}
        // draggable={true}
        onDrop={(event) => handleDropToAdd(event)}
        onDragOver={(event) => event.preventDefault()}
      >
        <i className="fas fa-plus-circle fa-4x"></i>
      </span>
      <span className="btn btn-primary Submit-Btn" onClick={handleSubmit}>
        Save
      </span>
      <span
        className="btn btn-primary Submit-Btn mr-4"
        onClick={(event) => {
          event.preventDefault();
          if (window.confirm("Are You Sure You Want To Exit?")) {
            handleSubmit();
            history.push(`/viewer/details/${model.storyID}`);
          }
        }}
      >
        Save & Exit
      </span>
    </div>
  );
}

export default ToolbarComponent;
