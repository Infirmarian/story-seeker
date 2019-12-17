import React from "react";
import { Link, useHistory } from "react-router-dom";
import { URL } from "../../utils/constants";
import "./Navbar.css";

function Navbar() {
  let history = useHistory();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      {/* logo */}
      <Link to="/" className="navbar-brand text-white nav-link">
        StorySeeker
      </Link>

      {/* toggle navbar button */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav text-right ml-auto">
          <li className="navbar-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link className="nav-link" to="/viewer">
              All Stories
            </Link>
          </li>
          <li className="navbar-item">
            <div
              className="nav-link"
              onClick={() => {
                console.log("logging out");
                fetch(URL + "/api/logout").then(() => {
                  history.push("/");
                });
              }}
            >
              Logout
            </div>
          </li>
          <li className="navbar-item">
            <Link className="nav-link" to="/viewer/new">
              New Story
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
