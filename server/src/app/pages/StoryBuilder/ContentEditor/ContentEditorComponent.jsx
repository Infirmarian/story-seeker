import React, { useState, useEffect } from "react";
import "./ContentEditor.css";
import PathContainer from "./PathContainer/PathContainer";
import { useInput } from "../utils/custom-hooks.js";

function ContentEditorComponent(props) {
  const { model, selectedNode } = props;
  const { removeNode, updateStartNode } = props;
  const {
    value: nodeContent,
    setValue: setNodeContent,
    reset: resetNodeContent,
    bind: bindNodeContent,
  } = useInput(
    selectedNode.getFullText(),
    selectedNode.setFullText,
    selectedNode
  );

  const {
    value: question,
    setValue: setQuestion,
    reset: resetQuestion,
    bind: bindQuestion,
  } = useInput(
    selectedNode.getQuestion(),
    selectedNode.setQuestion,
    selectedNode
  );
  useEffect(() => {
    setQuestion(selectedNode.getQuestion());
    setNodeContent(selectedNode.getFullText());
    return () => {
      setQuestion("");
      setNodeContent("");
    };
  }, [selectedNode]);

  const [isEndNode, setIsEndNode] = useState(false);
  useEffect(() => {
    setIsEndNode(selectedNode.isEnd);
  }, [selectedNode]);
  const toggleEndNode = () => {
    setIsEndNode((prev) => {
      if (!prev) {
        selectedNode.setEnd();
        setQuestion("");
      } else {
        selectedNode.resetEnd();
        setQuestion(selectedNode.getQuestion());
      }
      return !prev;
    });
  };
  return (
    <div className="Content-Editor">
      <div className="editor-section">
        <label className="input-labels" htmlFor="content">
          Content
        </label>
        <textarea
          className=" input-fields"
          name="content"
          id="content"
          placeholder="Create your story..."
          {...bindNodeContent}
        ></textarea>
        {!isEndNode ? (
          <div id="question-paths">
            <label className="input-labels" htmlFor="question">
              Question
            </label>
            <input
              className=" input-fields"
              name="question"
              id="question"
              placeholder="...?"
              {...bindQuestion}
            ></input>
            <label className="input-labels" htmlFor="">
              Paths
            </label>
            <PathContainer selectedNode={selectedNode} />
          </div>
        ) : null}
      </div>
      <div id="extra-section">
        {!selectedNode.isBeginning ? (
          <div id="end-beginning">
            <p
              className="btn extra-options editor-button"
              onClick={() => updateStartNode(selectedNode)}
            >
              Make This The Beginning
            </p>
            <p
              className="btn extra-options editor-button"
              onClick={toggleEndNode}
            >
              Toggle End Node
            </p>
          </div>
        ) : null}

        {model.getNodes().length > 1 ? (
          <p
            className="btn extra-options editor-button"
            onClick={() => removeNode(selectedNode)}
          >
            Remove Node
          </p>
        ) : null}
        {/* <button
          onClick={() => {
            console.log(model);
          }}
        >
          Check Model
        </button> */}
      </div>
    </div>
  );
}

export default ContentEditorComponent;
