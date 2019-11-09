import React, { useState, useEffect } from "react";
import PathGroup from "./PathGroup/PathGroup";
import "./PathContainer.css";

function PathContainer(props) {
	const { selectedNode } = props;

	const [paths, setPaths] = useState([]);
	useEffect(() => {
		if (selectedNode != null) {
			const ports = selectedNode.getOutputPorts();
			var result = [];
			ports.forEach((port) => {
				console.log(port.answer);
				result.push({
					id: port.options.id,
					answer: port.answer,
				});
			});
			setPaths(result);
		} else {
			setPaths([]);
		}
		return () => {
			setPaths([]);
		};
	}, [selectedNode]);
	const handleAddPath = () => {
		const addedPort = selectedNode.addOutputPort("");
		setPaths((prev) => {
			return [
				...prev,
				{
					id: addedPort.options.id,
					answer: addedPort.answer,
				},
			];
		});
	};
	const handleRemovePath = (path) => {
		console.log(path, paths);
		const port = paths[path];
		console.log(port);
		console.log(selectedNode.removeOutputPort(port.id));
		setPaths((prev) => {
			const newState = prev.filter((el, index) => {
				return index != path;
			});
			console.log(newState);
			return newState;
		});
	};

	return (
		<div>
			{paths != null
				? paths.map((path, index) => {
						return (
							<PathGroup
								key={index}
								label={index + 1}
								content={path.answer}
								removePath={handleRemovePath}
							/>
						);
				  })
				: null}
			<p
				className="btn"
				id="add-path-btn"
				style={
					paths.length < 3
						? { display: "block" }
						: { display: "none" }
				}
				onClick={paths.length < 3 ? handleAddPath : null}
			>
				Add Path
			</p>
		</div>
	);
}

export default PathContainer;
