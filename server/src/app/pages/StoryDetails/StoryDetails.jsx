import React, { useEffect } from "react";
import { URL } from "../../../utils/constants";
import { useHistory, useParams } from "react-router-dom";
import { useFormValidation } from "../../custom-hooks";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import InputField from "../../components/InputField/InputField";
import "./StoryDetails.css";

function SaveStoryContent(content, id, history) {
	if (id) {
		fetch(URL + "/api/overview/" + id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: content,
		}).then((response) => {
			if (response.status === 200) {
				window.alert("Successfully updated story content");
			} else {
				response.json().then((json) => {
					window.alert(`Error: ${json.error}`);
				});
			}
		});
	} else {
		fetch(URL + "/api/overview", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: content,
		}).then((response) => {
			response.json().then((json) => {
				if (response.status === 201) {
					console.log("Successfully created");
					const id = json.id;
					history.push("/viewer/details/" + id);
				} else {
					window.alert(json.error);
				}
			});
		});
	}
}
function DeleteStory(id, history) {
	if (
		window.confirm(
			"Are you sure you want to delete this story? This cannot be undone!",
		)
	) {
		fetch(URL + "/api/overview/" + id, {
			method: "DELETE",
		}).then((response) => {
			if (response.status === 200) {
				history.push("/viewer");
			} else {
				response.json().then((json) => {
					window.alert(`Failed to delete: ${json.error}`);
				});
			}
		});
	}
}

const validateDetails = (details) => {
	let errors = {};
	if (!details.title) {
		errors.title = "Title is required!";
	} else {
		errors.title = "";
	}

	if (!details.summary) {
		errors.summary = "Summary is required!";
	} else if (
		details.summary.split(" ").length < 2 ||
		!details.summary.split(" ")[1]
	) {
		errors.summary = "Summary must contain at least 2 words!";
	} else {
		errors.summary = "";
	}

	if (!details.genre) {
		errors.genre = "Genre must be specified!";
	} else {
		errors.genre = "";
	}

	return errors;
};

const newStoryValidate = (details) => {
	let errors = {};
	if (!details.title) {
		errors.title = "Title is required!";
	} else {
		errors.title = "";
	}
	return errors;
};

function StoryDetails(props) {
	let history = useHistory();
	const { id } = useParams();
	const newStory = id ? false : true;
	const INITIAL_DETAILS = newStory
		? {
				title: "",
		  }
		: {
				title: "",
				summary: "",
				genre: "",
				price: "",
				published: "",
				last_modified: "",
		  };

	const validation = newStory ? newStoryValidate : validateDetails;
	// Data for current story being viewed
	const {
		values: storyDetails,
		setValues: setStoryDetails,
		errors,
		submitting,
		handleChange,
		handleBlur,
	} = useFormValidation(INITIAL_DETAILS, validation);

	useEffect(() => {
		if (id) {
			fetch(URL + "/api/overview/" + id).then((response) => {
				response.json().then((json) => {
					setStoryDetails({
						title: json.title,
						summary: json.summary,
						genre: json.genre,
						price: json.price,
						published: json.published,
						last_modified: json.last_modified,
					});
				});
			});
		}
	}, [id, setStoryDetails]);
	const checkErrors = (errors) => {
		var errorFound = false;
		for (let error in errors) {
			if (errors[error]) {
				errorFound = true;
				break;
			}
		}
		return errorFound;
	};
	const {
		title,
		summary,
		genre,
		price,
		published,
		last_modified,
	} = storyDetails;

	const editStoryButton = id ? (
		<Button link={`/builder/${id}`}>Edit Story</Button>
	) : null;
	const deleteStoryButton = id ? (
		<Button
			color="alert"
			onClick={(event) => {
				event.preventDefault();
				DeleteStory(id, history);
				return false;
			}}
		>
			Delete Story
		</Button>
	) : null;
	const submitStoryButton = id ? (
		<Button
			onClick={(event) => {
				event.preventDefault();
				const s = window.confirm(
					"Are you sure you want to submit? You cannot make any more changes once the story has been submitted for approval",
				);
				if (!s) return false;
				fetch(URL + `/api/submit/${id}`, {
					method: "POST",
				}).then((response) => {
					if (response.status !== 200) {
						window.alert("Failed to submit for approval");
					}
				});
				return false;
			}}
		>
			Submit Story for Approval
		</Button>
	) : null;
	const previewStoryButton = id ? (
		<Button first link={`/preview/${id}`}>
			Preview Story
		</Button>
	) : null;

	console.log(errors);
	return (
		<div className="Story-Details">
			<Navbar
				links={[
					{ link: "/viewer", text: "All Stories" },
					{ link: "/account", text: "Account" },
				]}
			/>
			<form
				className={`details-form needs-validation ${
					errors ? "was-validated" : ""
				}`}
				onSubmit={(event) => {
					event.preventDefault();
					SaveStoryContent(
						JSON.stringify({
							title,
							summary: newStory ? null : summary,
							genre: newStory ? "adventure" : genre,
							price: newStory ? "0" : price,
						}),
						id,
						history,
					);
					return false;
				}}
				noValidate
			>
				<div className="info">
					<InputField
						name="title"
						type="text"
						value={title}
						onChange={handleChange}
						onBlur={handleBlur}
						autocomplete="off"
						error={errors.title}
					/>
					{newStory ? null : (
						<>
							<InputField
								field="textarea"
								name="summary"
								type="text"
								value={summary}
								onChange={handleChange}
								onBlur={handleBlur}
								autocomplete="off"
								required
								error={errors.summary}
							/>
							<InputField
								field="select"
								name="genre"
								size="sm"
								value={genre}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.genre}
							>
								<option value="adventure">Adventure</option>
								<option value="comedy">Comedy</option>
								<option value="fantasy">Fantasy</option>
								<option value="science fiction">Science Fiction</option>
								<option value="western">Western</option>
								<option value="romance">Romance</option>
								<option value="mystery">Mystery</option>
								<option value="detective">Detective</option>
								<option value="dystopia">Dystopia</option>
							</InputField>
							<InputField
								field="select"
								name="price"
								label="pricing"
								size="sm"
								value={price}
								onChange={handleChange}
								onBlur={handleBlur}
								enabled={false}
							>
								<option value="0">Free</option>
								<option value="1">$0.99</option>
							</InputField>
						</>
					)}
				</div>
				<div className="uneditable-info">
					<div className={`status status-${published}`}>
						{published
							? published === "not published"
								? "not\u00a0published"
								: published
							: "not\u00a0published"}
					</div>
					<div className="status status-primary">
						Last Modified: {last_modified ? last_modified : "N/A"}
					</div>
				</div>
				<div className="button-section">
					<Button first link="/viewer">
						Go Back
					</Button>
					<Button
						type="submit"
						disabled={checkErrors(errors) || submitting === true}
					>
						{newStory ? "Create Story" : "Save Details"}
					</Button>
					<br />
					{previewStoryButton}
					{editStoryButton}
					{submitStoryButton}
					{deleteStoryButton}
				</div>
			</form>
		</div>
	);
}

export default StoryDetails;
