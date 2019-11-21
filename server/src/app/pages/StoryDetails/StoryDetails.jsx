import React, { useState, useEffect } from "react";
import "./StoryDetails.css";

function StoryDetails(props) {
  const { id } = props.match.params;
  const [storyDetails, setStoryDetails] = useState({});
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => {
        return response.json();
      })
      .then(data => {
        const userStory = data.filter(el => {
          return el.userId === 1 && el.id === id;
        })[0];
        console.log(userStory);
        const genre =
          Math.floor(Math.random() * 2) === 0 ? "action" : "adventure";
        const publishDate =
          Math.floor(Math.random() * 2) === 0
            ? new Date()
            : "Not Yet Published";
        setStoryDetails({
          title: userStory.title,
          description: userStory.body,
          genre,
          tags: ["action", "adventure", "horror", "tragedy", "comedy"],
          publishDate
        });
      });
    return () => {
      setStoryDetails({});
    };
  }, [id]);

  const { title, description, genre, tags, publishDate } = storyDetails;

  return (
    <div className="StoryDetails">
      <div className="input-group">
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" value={title} />
      </div>
      <div className="input-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={description}
        ></textarea>
      </div>
      <p>
        Publish Date:
        {publishDate instanceof Date
          ? `${publishDate.getMonth() +
              1}/${publishDate.getDate()}/${publishDate.getYear() + 1900}`
          : publishDate}
      </p>
      <div className="input-group">
        <label htmlFor="genre">Genre</label>
        <input type="text" name="genre" id="genre" value={genre} />
      </div>
      <div className="input-group">
        <label htmlFor="tags">Tags</label>
        <input type="text" name="tags" id="tags" value={tags} />
      </div>
    </div>
  );
}

export default StoryDetails;
