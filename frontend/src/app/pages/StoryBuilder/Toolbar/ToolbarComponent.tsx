import React from "react";
import { StoryNode } from "../StoryNode";
import { AnswerPort } from "../CustomPorts";
import "./Toolbar.css";
import { DefaultLinkModel } from "@projectstorm/react-diagrams";

interface ToolbarProps {
	node: StoryNode;
	addNode: () => void;
	removeNode: (node: StoryNode) => void;
	updateStartNode: (node: StoryNode) => void;
}

function ToolbarComponent(props: any) {
	const { model, addNode } = props;

	const convertModelToJSON = () => {
		var result: { content: Array<any> } = {
			content: [],
		};
		const nodes = model.getNodes();
		// console.log(nodes);
		nodes.forEach((node: StoryNode) => {
			const main = node.text;
			const question = node.question;
			var options: Array<Array<any>> = [];
			// console.log(main, question);
			node.getOutputPorts().forEach((port: AnswerPort) => {
				const links = port.getLinks();
				// console.log("current port:", port, "links:", links);
				// console.log(links.getTargetPort().getNode());
				for (var link in links) {
					// console.logs(link, links[link]);
					const linkedNode = links[link].getTargetPort().getNode();
					options.push([port.answer, linkedNode.getOptions().id]);
				}
			});
			result.content.push({
				main,
				question,
				options,
			});
		});
		// console.log(result);
		// console.log(JSON.stringify(result));
		return JSON.stringify(result);
	};

	const handleSubmit = () => {
		const submission = convertModelToJSON();
		console.log(submission);
	};

	return (
		<div className="Toolbar">
			<button onClick={() => addNode()}>Add Node</button>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
}

export default ToolbarComponent;
