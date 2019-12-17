import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { URL } from "../../../utils/constants";
import "./StoryDetails.css";
import Navbar from "../../components/Navbar";
import { useHistory } from "react-router-dom";

function SaveStoryContent(content, id, history) {
  if (id) {
    fetch(URL + "/api/overview/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: content
    });
  } else {
    fetch(URL + "/api/overview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: content
    }).then(response => {
      response.json().then(json => {
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
      "Are you sure you want to delete this story? This cannot be undone!"
    )
  ) {
    fetch(URL + "/api/overview/" + id, {
      method: "DELETE"
    }).then(response => {
      if (response.status === 200) {
        history.push("/viewer");
      } else {
        response.json().then(json => {
          console.error(json);
        });
      }
    });
  }
}
function StoryDetails(props) {
  let history = useHistory();
  const { id } = props.match.params;
  const [storyDetails, setStoryDetails] = useState({});
  useEffect(() => {
    if (id) {
      fetch(URL + "/api/overview/" + id).then(response => {
        response.json().then(json => {
          setStoryDetails({
            title: json.title,
            summary: json.summary,
            genre: json.genre,
            published: json.published,
            last_modified: json.last_modified
          });
        });
      });
    }
  }, [id]);

  const { title, summary, genre, published, last_modified } = storyDetails;
  const editStoryButton = id ? (
    <Link to={"/builder/" + id} className={"btn btn-primary "}>
      Edit Story
    </Link>
  ) : null;
  const deleteStoryButton = id ? (
    <button
      className="btn btn-alert"
      onClick={event => {
        event.preventDefault();
        DeleteStory(id, history);
        return false;
      }}
    >
      Delete
    </button>
  ) : null;
  const submitStoryButton = id ? (
    <button
      className="btn btn-primary"
      onClick={event => {
        event.preventDefault();
        const s = window.confirm(
          "Are you sure you want to submit? You cannot make any more changes once the story has been submitted for approval"
        );
        if (!s) return false;
        fetch(URL + `/api/submit/${id}`, {
          method: "POST"
        }).then(response => {
          if (response.status !== 200) {
            window.alert("Failed to submit for approval");
          }
        });
        return false;
      }}
    >
      Submit for Approval
    </button>
  ) : null;
  return (
    <div>
      <Navbar />
      <form
        className="Story-Details"
        onSubmit={event => {
          event.preventDefault();
          SaveStoryContent(
            JSON.stringify({
              title: event.target.title.value,
              summary: event.target.summary.value,
              genre: event.target.genre.value
            }),
            id,
            history
          );
          return false;
        }}
      >
        <label htmlFor="title">Title</label>
        <input
          className="form-control"
          id="title"
          type="text"
          name="title"
          defaultValue={title}
        />
        <label htmlFor="summary">Summary</label>
        <textarea
          className="form-control"
          id="summary"
          type="text"
          defaultValue={summary}
        />
        <label htmlFor="genre">Genre</label>
        <select
          id="genre"
          className="form-control form-control-sm"
          value={genre}
          onChange={event => {
            console.log(event.target.value);
            setStoryDetails({ title, summary, genre: event.target.value });
          }}
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
        </select>
        <div
          className={
            published
              ? `publish-status publish-status-${published}`
              : "publish-status"
          }
        >
          {published
            ? published === "not published"
              ? "not\u00a0published"
              : published
            : "not\u00a0published"}
        </div>
        <div>Last Modified: {last_modified}</div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        {editStoryButton}
        {submitStoryButton}
        {deleteStoryButton}
      </form>
    </div>
  );
}

export default StoryDetails;
