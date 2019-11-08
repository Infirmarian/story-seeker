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
	const { selectedNode } = props;
	const { addNode, removeNode, updateStartNode } = props;

	return (
		<div className="Toolbar">
			<button onClick={() => addNode()}>Add Node</button>
			<button onClick={() => removeNode(selectedNode)}>
				Remove Current Node
			</button>
		</div>
	);
}

export default ToolbarComponent;
