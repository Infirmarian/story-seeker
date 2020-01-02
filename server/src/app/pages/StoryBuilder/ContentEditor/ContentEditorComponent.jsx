import React, { useState, useEffect } from "react";
import { useInput } from "../utils/custom-hooks.js";
import PathContainer from "./PathContainer/PathContainer";
import Button from "../../../components/Button/Button";
import "./ContentEditor.css";

function ContentEditorComponent(props) {
	const { model, selectedNode } = props;
	const { removeNode, updateStartNode } = props;
	const {
		//value: nodeContent,
		setValue: setNodeContent,
		//reset: resetNodeContent,
		bind: bindNodeContent,
	} = useInput(
		selectedNode.getFullText(),
		selectedNode.setFullText,
		selectedNode,
	);

	const {
		//    value: question,
		setValue: setQuestion,
		//    reset: resetQuestion,
		bind: bindQuestion,
	} = useInput(
		selectedNode.getQuestion(),
		selectedNode.setQuestion,
		selectedNode,
	);
	useEffect(() => {
		setQuestion(selectedNode.getQuestion());
		setNodeContent(selectedNode.getFullText());
		return () => {
			setQuestion("");
			setNodeContent("");
		};
	}, [selectedNode, setNodeContent, setQuestion]);

	const [isBeginning, setIsBeginning] = useState(false);
	useEffect(() => {
		setIsBeginning(selectedNode.isBeginning);
	}, [selectedNode]);
	const makeBeginningNode = () => {
		setIsBeginning(true);
		setIsEndNode(false);
		updateStartNode(selectedNode);
	};

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
					placeholder={
						selectedNode.isBeginning
							? "Create your story..."
							: "Continue your story..."
					}
					{...bindNodeContent}
				></textarea>
				{!isEndNode ? (
					<div id="question-paths">
						<label className="input-labels" htmlFor="question">
							Question
						</label>
						<input
							className=" input-fields"
							name="question"
							id="question"
							placeholder="...?"
							{...bindQuestion}
						></input>
						<label className="input-labels" htmlFor="">
							Paths
						</label>
						<PathContainer selectedNode={selectedNode} />
					</div>
				) : null}
			</div>
			<div id="extra-section">
				{!isBeginning ? (
					<div id="end-beginning">
						<Button className="extra-options" onClick={makeBeginningNode}>
							Make This The Beginning
						</Button>
						<Button className="extra-options" onClick={toggleEndNode}>
							Toggle End Node
						</Button>
					</div>
				) : null}

				{model.getNodes().length > 1 ? (
					<Button
						color="alert"
						className="extra-options"
						onClick={() => removeNode(selectedNode)}
					>
						Remove This Node
					</Button>
				) : null}
				{/* <button
          onClick={() => {
            console.log(model);
          }}
        >
          Check Model
        </button> */}
			</div>
		</div>
	);
}

export default ContentEditorComponent;
