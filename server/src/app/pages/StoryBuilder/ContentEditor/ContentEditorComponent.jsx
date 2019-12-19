import React, { useState, useEffect } from "react";
import "./ContentEditor.css";
import PathContainer from "./PathContainer/PathContainer";
import { useInput } from "../utils/custom-hooks.js";
import { DiagramModel } from "@projectstorm/react-diagrams";
// interface EditorProps {
// 	selectedNode: StoryNode;
// 	nodeContent: string;
// 	addNode: () => void;
// 	removeNode: (node: StoryNode) => void;
// 	updateStartNode: (node: StoryNode) => void;
// }

// interface EditorState {
// 	paths: Array<any>;
// 	setPaths: SetStateAction<Array<any>>;
// }

function ContentEditorComponent(props) {
  const { model, engine, selectedNode } = props;
  const { setEngineModel, removeNode, updateStartNode } = props;
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
    <div className="Content-Editor bg-primary">
      <div className="editor-section bg-primary">
        <label className="input-labels" htmlFor="content">
          Content
        </label>
        <textarea
          className=" input-fields"
          name="content"
          id="content"
          {...bindNodeContent}
        ></textarea>
        {!isEndNode ? (
          <label className="input-labels" htmlFor="question">
            Question
          </label>
        ) : null}
        {!isEndNode ? (
          <input
            className=" input-fields"
            name="question"
            id="question"
            {...bindQuestion}
          ></input>
        ) : null}
        {!isEndNode ? (
          <label className="input-labels" htmlFor="">
            Paths
          </label>
        ) : null}
        {!isEndNode ? <PathContainer selectedNode={selectedNode} /> : null}
      </div>
      <div className="extra-section">
        {!selectedNode.isBeginning ? (
          <p
            className="btn extra-options editor-button"
            onClick={() => updateStartNode(selectedNode)}
          >
            Make This The Beginning
          </p>
        ) : null}
        {!selectedNode.isBeginning ? (
          <p
            className="btn extra-options editor-button"
            onClick={toggleEndNode}
          >
            Toggle End Node
          </p>
        ) : null}

        {model.getNodes().length > 1 ? (
          <p
            className="btn extra-options editor-button"
            onClick={() => removeNode(selectedNode)}
          >
            Remove This Node
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default ContentEditorComponent;
