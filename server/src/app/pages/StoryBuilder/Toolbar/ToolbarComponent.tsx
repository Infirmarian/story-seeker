import React from "react";
import { StoryNode } from "../StoryNode";
import { AnswerPort } from "../CustomPorts";
import "./Toolbar.css";

interface ToolbarProps {
	node: StoryNode;
	addNode: () => void;
	removeNode: (node: StoryNode) => void;
	updateStartNode: (node: StoryNode) => void;
}

function ToolbarComponent(props: any) {
	const { model, addNode } = props;

	const convertModelToJSON = () => {
		var result: { content: Array<any>, title: string} = {
			content: Array(model.getNodes().length),
			title: "title",
		};
		var mapping: {[index: string]: number} = {};
		var counter = 1;
		const nodes = model.getNodes();
		nodes.forEach((node: StoryNode) => {
			const id = node.getID();// .getOptions().id;
			if(node.isBeginning){
				mapping[id] = 0;
			}else{
				mapping[id] = counter;
				counter += 1;
			}
		})
		nodes.forEach((node: StoryNode) => {
			const main = node.text;
			const question = node.question;
			var options: Array<Array<any>> = [];
			node.getOutputPorts().forEach((port: AnswerPort) => {
				const links = port.getLinks();
				for (var link in links) {
					const linkedNode = mapping[links[link].getTargetPort().getNode().getID()];
					options.push([port.answer, linkedNode]);
				}
			});
			if(options.length > 0)
				result.content[mapping[node.getID()]] = {
					main,
					question,
					options
				};
			else
				result.content[mapping[node.getID()]] = {main};
		});
		return JSON.stringify(result);
	};

	const handleSubmit = () => {
		const submission = convertModelToJSON();
		console.log(submission);
		//fetch() TODO:
	};

	return (
		<div className="Toolbar">
			<span
				id="Add-Btn"
				className="toolbar-btn"
				onClick={() => addNode()}
			>
				<i className="fas fa-plus-circle fa-4x"></i>
			</span>
			<span
				id="Submit-Btn"
				className="toolbar-btn"
				onClick={handleSubmit}
			>
				Submit
			</span>
		</div>
	);
}

export default ToolbarComponent;
