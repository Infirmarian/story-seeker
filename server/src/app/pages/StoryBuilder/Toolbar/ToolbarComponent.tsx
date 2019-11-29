import React from "react";
import { StoryNode } from "../StoryNode";
import "./Toolbar.css";
import { DefaultPortModel } from "@projectstorm/react-diagrams";
// import { Link } from "react-router-dom";

interface ToolbarProps {
	node: StoryNode;
	addNode: () => void;
	removeNode: (node: StoryNode) => void;
	updateStartNode: (node: StoryNode) => void;
}

function ToolbarComponent(props: any) {
	const { engine, model, addNode, addNodeOnDrop } = props;

	const convertModelToJSON = () => {
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
	};

	const handleSubmit = () => {
		const submission = convertModelToJSON();
		console.log(submission);
		//fetch() TODO:
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
			<span
				className="toolbar-btn"
				id="Submit-Btn"
				onClick={handleSubmit}
			>
				Submit
			</span>
		</div>
	);
}

export default ToolbarComponent;
