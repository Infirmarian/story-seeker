import React, { useEffect, useState } from "react";
import { URL } from "../../../utils/constants";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import "./AllStories.css";

function AllStories(props) {
  const history = useHistory();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const access = sessionStorage.getItem("access");
    if (token) {
      if (access !== "admin") {
        history.push("/403");
      }
      fetch(`${URL}/api/stories`, {
        method: "GET",
        headers: new Headers({
          Authorization: token,
        }),
      }).then((resp) => {
        resp.json().then((json) => {
          console.log(json);
          setStories(json.stories);
          setLoading(false);
        });
      });
    } else {
      history.push("/login");
    }
  }, [history]);
  return (
    <div>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Status</th>
              <th scope="col">Last Modified</th>
              <th scope="col">Preview</th>
              <th scope="col">Revoke</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => {
              return (
                <tr key={story.id}>
                  <td>{story.title}</td>
                  <td>{story.author}</td>
                  <td>
                    <div className={`status status-${story.published}`}>
                      {story.published}
                    </div>
                  </td>
                  <td>{story.last_modified}</td>
                  <td>
                    <Link to={`/story/${story.id}`}>Story</Link>
                  </td>
                  <td>
                    {story.published === "published" ? (
                      <button
                        className="reject"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to revoke ${story.title}? There may be serious ramifications and this may negatively impact end customer experience`
                            )
                          ) {
                            fetch(`${URL}/api/revoke/${story.id}`, {
                              headers: new Headers({
                                Authorization: sessionStorage.getItem("token"),
                              }),
                            }).then((resp) => {
                              if (resp.ok) {
                                history.replace("/story");
                              }
                            });
                          }
                        }}
                      >
                        <span>⚠️</span>
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default AllStories;
