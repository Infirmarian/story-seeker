import React, { useState, useEffect } from "react";
import { URL } from "../../../utils/constants";
import "./StoryDetails.css";
import Navbar from "../../components/Navbar";

function SaveStoryContent(content, id) {
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
    });
  }
}

function StoryDetails(props) {
  const { id } = props.match.params;
  const [storyDetails, setStoryDetails] = useState({});
  useEffect(() => {
    if (id) {
      fetch(URL + "/api/overview/" + id).then(response => {
        response.json().then(json => {
          console.log(json.genre);
          setStoryDetails({
            title: json.title,
            summary: json.summary,
            genre: json.genre
          });
        });
      });
    }
  }, [id]);

  const {
    title,
    summary,
    genre,
    publishDate,
    creationDate,
    lastModified
  } = storyDetails;
  return (
    <div className="Story-Details">
      <Navbar />
      <form
        onSubmit={event => {
          event.preventDefault();
          SaveStoryContent(
            JSON.stringify({
              title: event.target.title.value,
              summary: event.target.summary.value,
              genre: event.target.genre.value
            }),
            id
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
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}

export default StoryDetails;
