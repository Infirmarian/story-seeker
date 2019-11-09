import React from "react";
import { StoryNode } from "../StoryNode";
import "./ContentEditor.css";

interface EditorProps {
	selectedNode: StoryNode;
	nodeContent: string;
	addNode: () => void;
	removeNode: (node: StoryNode) => void;
	updateStartNode: (node: StoryNode) => void;
}

function ToolbarComponent(props: any) {
	const { selectedNode, nodeContent } = props;
	console.log(selectedNode);
	const { addNode, removeNode, updateStartNode, updateNodeContent } = props;

	const handleTextEditorChange = (event: any) => {
		if (selectedNode != null) {
			// console.log("change", event.target.value);
			updateNodeContent(event.target.value);
		}
	};

	return (
		<div className="Editor">
			<textarea
				name=""
				id=""
				value={selectedNode ? nodeContent : ""}
				onChange={(event) => handleTextEditorChange(event)}
			></textarea>
			<button onClick={() => addNode()}>Add Node</button>
			<button onClick={() => removeNode(selectedNode)}>
				Remove Current Node
			</button>
			<button
				onClick={() => selectedNode.addOutputPort()}
				disabled={
					selectedNode ? selectedNode.getOutputPorts() >= 3 : false
				}
			>
				Add Question
			</button>
		</div>
	);
}

export default ToolbarComponent;
