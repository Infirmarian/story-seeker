import React from "react";
import "./PathGroup.css";

function PathGroup(props) {
	const { label, content, removePath } = props;
	return (
		<div className="path-group">
			<label className="path-label" htmlFor="path-1">
				{label}
			</label>
			<input
				className="path-input input-fields"
				name="path-1"
				id="path-1"
				value={content}
				onChange={null}
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
