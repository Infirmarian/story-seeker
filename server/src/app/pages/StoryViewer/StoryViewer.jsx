import React, { useState, useEffect } from "react";
import StoryCard from "./StoryCard/StoryCard";
import "./StoryViewer.css";

function StoryViewer() {
	const [stories, setStories] = useState([]);
	useEffect(() => {
		// fetch user data
		fetch("https://jsonplaceholder.typicode.com/posts")
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				const userStories = data
					.filter((el) => {
						return el.userId === 1;
					})
					.slice(0, 5);
				console.log(userStories);
				setStories(userStories);
			})
			.catch((error) => {
				console.error(error);
			});
		return () => {
			setStories([]);
		};
	}, []);

	return (
		<div className="Story-Viewer">
			<div className="card-container">
				{stories.map((story) => {
					return (
						<StoryCard
							key={story.id}
							id={story.id}
							title={story.title}
							description={story.body}
							publishStatus={"Not Yet Published"}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default StoryViewer;
