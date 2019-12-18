import React from "react";
import "./PathGroup.css";

function PathGroup(props) {
  const { label, content, removePath, updatePath } = props;
  return (
    <div className="path-group">
      <label className="path-label" htmlFor={`path-${label}`}>
        C{label}
      </label>
      <input
        className="path-input input-fields path-fields"
        name={`path-${label}`}
        id={`path-${label}`}
        placeholder={`choice ${label}`}
        value={content}
        onChange={(event) => {
          console.log(event.target.value);
          updatePath(event.target.value, label - 1);
        }}
      ></input>
      {/* <div className="delete-btn btn">x</div> */}
      <span
        className="delete"
        onClick={() => {
          removePath(label - 1);
        }}
      >
        {/* <span className="delete-btn">x</span> */}
        <i className="fas fa-times delete-btn"></i>
        {/* <i className="fas fa-times-circle delete-btn"></i> */}
      </span>
    </div>
  );
}

export default PathGroup;
