import React from "react";
import { Link } from "react-router-dom";
import "./StoryCard.css";

function StoryCard(props) {
	const { id, title, description, publishStatus } = props;
	console.log(title, description);
	return (
		<div className="StoryCard">
			<p className="story-title">{title}</p>
			<div className="description-container">
				<label>Description</label>
				<span className="underline"></span>
				<p className="story-description">{description}</p>
				<p>Publish Date: {publishStatus}</p>
			</div>
			<span className="story-options">
				<Link className="option-btn" to={`/viewer/details/${id}`}>
					View Details
				</Link>
				<Link className="option-btn" to="builder">
					Build
				</Link>
			</span>
		</div>
	);
}

export default StoryCard;
