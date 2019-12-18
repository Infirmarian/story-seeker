import React, { useState, useEffect } from "react";
import { URL } from "../../../utils/constants";
import { useHistory, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./StoryViewer.css";

function StoryViewer() {
  const [stories, setStories] = useState([]);
  let history = useHistory();
  useEffect(() => {
    // fetch user data
    fetch(URL + "/api/list")
      .then(response => {
        if (response.status === 403) {
          history.push("/login");
        } else {
          response.json().then(json => {
            console.log(json);
            setStories(json.stories);
          });
        }
      })
      .catch(error => {
        console.error(error);
        history.push("/login");
      });
  }, [history]);
  return (
    <div className="Story-Viewer">
      <Navbar />
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Genre</th>
            <th scope="col">Status</th>
            <th scope="col">Price</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {stories.map(story => {
            return (
              <tr>
                <td>{story.title}</td>
                <td>{story.genre}</td>
                <td>
                  <div
                    className={`publish-status publish-status-${story.published}`}
                  >
                    {story.published === "not published"
                      ? "not\u00a0published"
                      : story.published}
                  </div>
                </td>
                <td>
                  {story.price === 0 ? "free" : "$" + (story.price - 0.01)}
                </td>
                <td>
                  <Link to={`/viewer/details/${story.id}`}> Details </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StoryViewer;
