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
				{!isEndNode ? (
					<PathContainer
						engine={engine}
						selectedNode={selectedNode}
					/>
				) : null}
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
						Remove Node
					</p>
				) : null}
				<button onClick={() => console.log(model)}>Check Model</button>
				<button
					onClick={() => {
						console.log("serialize", model.serialize());
						var str = JSON.stringify(model.serialize());
						console.log(str);
						var model2 = new DiagramModel();
						model2.deserializeModel(JSON.parse(str), engine);
						console.log("deserialize", model2);
						console.log("original", model);
						setEngineModel(model2);
					}}
				>
					Serialize Model
				</button>
			</div>
		</div>
	);
}

export default ContentEditorComponent;
