import React from "react";
import "./PathGroup.css";

function PathGroup(props) {
	const { label, content, removePath, updatePath } = props;
	return (
		<div className="path-group">
			<label className="path-label" htmlFor={`path-${label}`}>
				C{label}
			</label>
			<input
				className="path-input input-fields"
				name={`path-${label}`}
				id={`path-${label}`}
				value={content}
				onChange={(event) => {
					console.log(event.target.value);
					updatePath(event.target.value, label - 1);
				}}
			></input>
			{/* <div className="delete-btn btn">x</div> */}
			<span
				className="btn"
				onClick={() => {
					removePath(label - 1);
				}}
			>
				<i className="fas fa-times-circle" id="delete-btn"></i>
			</span>
		</div>
	);
}

export default PathGroup;
