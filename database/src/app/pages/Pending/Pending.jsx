import React, { useEffect, useState } from "react";
import { URL } from "../../../utils/constants";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import "./Pending.css";

function Pending(props) {
  const history = useHistory();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log(token);
    if (token) {
      fetch(`${URL}/api/pending`, {
        method: "GET",
        headers: new Headers({
          Authorization: token,
        }),
      }).then((resp) => {
        resp.json().then((json) => {
          setPending(json.stories);
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
      ) : pending.length === 0 ? (
        <h1>No stories pending approval</h1>
      ) : (
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Submitted</th>
              <th scope="col">Preview</th>
              <th scope="col">Approve</th>
              <th scope="col">Reject</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((story) => {
              return (
                <tr key={story.id}>
                  <td>{story.title}</td>
                  <td>{story.last_modified}</td>
                  <td>
                    <Link to={`/story/${story.id}`}>Story</Link>
                  </td>
                  <td>
                    <button
                      className="approve"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to approve ${story.title}?`
                          )
                        ) {
                          const token = sessionStorage.getItem("token");
                          fetch(`${URL}/api/approve/${story.id}`, {
                            method: "GET",
                            headers: new Headers({
                              Authorization: token,
                            }),
                          }).then((resp) => {
                            if (resp.ok) {
                              window.alert("Accepted story");
                            } else {
                              window.alert(
                                "Something went wrong and it failed to be accepted"
                              );
                            }
                          });
                        }
                      }}
                    >
                      <span>✅</span>
                    </button>
                  </td>
                  <td>
                    <button
                      className="reject"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to reject ${story.title}?`
                          )
                        ) {
                          const token = sessionStorage.getItem("token");
                          fetch(`${URL}/api/reject/${story.id}`, {
                            method: "GET",
                            headers: new Headers({
                              Authorization: token,
                            }),
                          }).then((resp) => {
                            if (resp.ok) {
                              console.log("Rejected");
                              history.push("/pending");
                            } else {
                              window.alert(
                                "Something went wrong and it failed to be rejected"
                              );
                            }
                          });
                        }
                      }}
                    >
                      <span>❌</span>
                    </button>
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
export default Pending;
