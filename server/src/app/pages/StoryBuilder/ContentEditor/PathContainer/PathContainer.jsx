import React, { useState, useEffect } from "react";
import PathGroup from "./PathGroup/PathGroup";
import "./PathContainer.css";

function PathContainer(props) {
  const { selectedNode } = props;

  const [paths, setPaths] = useState([]);
  useEffect(() => {
    if (selectedNode !== null) {
      const ports = selectedNode.getOutPorts();
      var result = [];
      ports.forEach((port) => {
        console.log(port.answer);
        result.push({
          id: port.getOptions().id,
          answer: port.answer,
        });
      });
      setPaths(result);
    } else {
      setPaths([]);
    }
    return () => {
      setPaths([]);
    };
  }, [selectedNode]);
  const handleAddPath = () => {
    const addedPort = selectedNode.addOutputPort("");
    if (addedPort !== false) {
      setPaths((prev) => {
        return [
          ...prev,
          {
            id: addedPort,
            answer: "",
          },
        ];
      });
    }
  };
  const handleRemovePath = (path) => {
    // console.log(path, paths);
    const port = paths[path];
    console.log(selectedNode.removeOutputPort(port.id));
    setPaths((prev) => {
      const newState = prev.filter((el, index) => {
        return index !== path;
      });
      // console.log(newState);
      return newState;
    });
  };

  const handleUpdatePath = (message, path) => {
    // console.log(message);
    const port = paths[path];
    if (selectedNode.updateOutputPort(port.id, message)) {
      // console.log("update");
      setPaths((prev) => {
        var newState = [...prev];
        newState[path] = {
          id: prev[path].id,
          answer: message,
        };
        return newState;
      });
    }
  };

  return (
    <div>
      {paths != null
        ? paths.map((path, index) => {
            return (
              <PathGroup
                key={index}
                label={index + 1}
                content={path.answer}
                removePath={handleRemovePath}
                updatePath={handleUpdatePath}
              />
            );
          })
        : null}
      <span id="add-btn-container">
        <p
          className="btn btn-primary mr-0"
          id="add-btn"
          style={paths.length < 3 ? { display: "block" } : { display: "none" }}
          onClick={paths.length < 3 ? handleAddPath : null}
        >
          Add Path
        </p>
      </span>
    </div>
  );
}

export default PathContainer;
