import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import { URL } from "../../../utils/constants";
import "./StoryPreview.css";
function StoryPreview(props) {
	const { id } = props.match.params;
	const [current, setCurrent] = useState(0);
	const [story, setStory] = useState({});
	const [back, setBack] = useState([]);
	useEffect(() => {
		fetch(`${URL}/api/preview/${id}`).then((response) => {
			if (response.status === 200) {
				response.json().then((json) => {
					setStory(json);
				});
			}
		});
	}, [id]);
	const backButton =
		back.length > 0 ? (
			<Button
				onClick={() => {
					setCurrent(back[back.length - 1]);
					setBack(back.slice(0, back.length - 1));
				}}
			>
				Back
			</Button>
		) : null;

	if (typeof current === "string") {
		return (
			<>
				<Navbar />
				<h1 className="title-text">{story.title}</h1>
				<h3 className="title-text">
					This story option hasn't been created yet
				</h3>
				{backButton}
			</>
		);
	}
	let optCount = 0;
	return (
		<>
			<Navbar
				links={[
					{ link: "/viewer", text: "All Stories" },
					{ link: `/viewer/details/${id}`, text: "Back" },
				]}
			/>
			<div className="container text-center my-auto">
				<h1 className="title-text-preview">{story.title}</h1>
				<p className="main-text-preview">
					{story.content ? story.content[current].main : null}
				</p>
				<p className="question-preview">
					{story.content ? story.content[current].question : null}
				</p>
				{backButton}
				{story.content && story.content[current].options
					? story.content[current].options.map((o) => {
							return (
								<Button
									key={optCount++}
									onClick={() => {
										const b = back;
										b.push(current);
										setBack(b);
										setCurrent(o[1]);
									}}
									disabled={o[1] instanceof String}
								>
									{o[0]}
								</Button>
							);
					  })
					: null}
			</div>
		</>
	);
}
export default StoryPreview;
