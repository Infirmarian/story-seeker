import React, { useState } from "react";
import { StoryNode } from "../StoryNode";
import "./ContentEditor.css";
import PathGroup from "./PathContainer/PathGroup/PathGroup";
import PathContainer from "./PathContainer/PathContainer";

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
	const { selectedNode, nodeContent } = props;
	console.log(selectedNode);
	const { removeNode, updateStartNode, updateNodeContent } = props;

	const handleTextEditorChange = (event) => {
		if (selectedNode != null) {
			// console.log("change", event.target.value);
			updateNodeContent(event.target.value);
		}
	};

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
					value={selectedNode ? nodeContent : ""}
					onChange={(event) => handleTextEditorChange(event)}
				></textarea>
				<label className="input-labels" htmlFor="question">
					Question
				</label>
				<input
					className=" input-fields"
					name="question"
					id="question"
				></input>
				<label className="input-labels" htmlFor="">
					Paths
				</label>
				<PathContainer selectedNode={selectedNode} />
			</div>
			<p className="btn" onClick={() => removeNode(selectedNode)}>
				Remove Node
			</p>
		</div>
	);
}

export default ContentEditorComponent;
