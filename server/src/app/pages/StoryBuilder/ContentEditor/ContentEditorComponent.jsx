import React, { useState, useEffect } from "react";
import "./ContentEditor.css";
import PathContainer from "./PathContainer/PathContainer";
import { useInput } from "../utils/custom-hooks.js";
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
  const { removeNode, updateStartNode } = props;
  const {
    value: nodeContent,
    setValue: setNodeContent,
    reset: resetNodeContent,
    bind: bindNodeContent
  } = useInput(
    selectedNode.getFullText(),
    selectedNode.setFullText,
    selectedNode
  );

  const {
    value: question,
    setValue: setQuestion,
    reset: resetQuestion,
    bind: bindQuestion
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

<<<<<<< HEAD
  return (
    <div className="Content-Editor">
      <p id="node-title">Node Title</p>
      <div className="editor-section">
        <label className="input-labels" htmlFor="content">
          Content
        </label>
        <textarea
          className=" input-fields"
          name="content"
          id="content"
          {...bindNodeContent}
        ></textarea>
        <label className="input-labels" htmlFor="question">
          Question
        </label>
        <input
          className=" input-fields"
          name="question"
          id="question"
          {...bindQuestion}
        ></input>
        <label className="input-labels" htmlFor="">
          Paths
        </label>
        <PathContainer engine={engine} selectedNode={selectedNode} />
      </div>
      <div className="extra-section">
        {selectedNode.isBeginning ? null : (
          <p
            className="btn extra-options"
            onClick={() => updateStartNode(selectedNode)}
          >
            Make This The Beginning
          </p>
        )}
        {model.getNodes().length > 1 ? (
          <p
            className="btn extra-options"
            onClick={() => removeNode(selectedNode)}
          >
            Remove Node
          </p>
        ) : null}
      </div>
    </div>
  );
=======
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
					{...bindNodeContent}
				></textarea>
				<label className="input-labels" htmlFor="question">
					Question
				</label>
				<input
					className=" input-fields"
					name="question"
					id="question"
					{...bindQuestion}
				></input>
				<label className="input-labels" htmlFor="">
					Paths
				</label>
				<PathContainer engine={engine} selectedNode={selectedNode} />
			</div>
			<div className="extra-section">
				<p
					className="btn extra-options editor-button"
					onClick={() => updateStartNode(selectedNode)}
				>
					Make This The Beginning
				</p>
				<p
					className="btn extra-options editor-button"
					onClick={() => removeNode(selectedNode)}
				>
					Remove Node
				</p>
			</div>
		</div>
	);
>>>>>>> json-submission-format
}

export default ContentEditorComponent;
