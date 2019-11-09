import React from "react";
import { StoryNode } from "../StoryNode";
import "./Toolbar.css";

interface ToolbarProps {
	node: StoryNode;
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
		<div className="Toolbar">
			<form action="">
				<textarea
					name=""
					id=""
					value={selectedNode ? nodeContent : ""}
					onChange={(event) => handleTextEditorChange(event)}
				></textarea>
			</form>
			<button onClick={() => addNode()}>Add Node</button>
			<button onClick={() => removeNode(selectedNode)}>
				Remove Current Node
			</button>
		</div>
	);
}

export default ToolbarComponent;