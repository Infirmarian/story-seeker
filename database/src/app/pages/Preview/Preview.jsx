import React from "react";
import { useEffect } from "react";
import { URL } from "../../../utils/constants";
import { useState } from "react";
import { useHistory } from "react-router";
import "./Preview.css";

function Preview(props) {
  const { storyid } = props.match.params;
  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [back, setBack] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`${URL}/api/preview/${storyid}`, {
      method: "GET",
      headers: new Headers({
        Authorization: token,
      }),
    }).then((resp) => {
      if (!resp.ok) {
        history.push("/login");
      }
      resp.json().then((json) => {
        setLoading(false);
        setStory(json);
      });
    });
  }, [storyid, history]);

  const backButton =
    back.length > 0 ? (
      <button
        className="btn btn-primary"
        onClick={() => {
          setCurrent(back[back.length - 1]);
          setBack(back.slice(0, back.length - 1));
        }}
      >
        Back
      </button>
    ) : null;
  let optCount = 0;
  console.log(story);
  return loading ? (
    <h1>Loading</h1>
  ) : (
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
              <button
                className="btn btn-primary"
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
              </button>
            );
          })
        : null}
    </div>
  );
}

export default Preview;
