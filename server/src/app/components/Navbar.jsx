import React from "react";
import { Link, useHistory } from "react-router-dom";
import { URL } from "../../utils/constants";
import "./Navbar.css";

function Navbar(props) {
  let history = useHistory();
  const { links } = props;
  const navlinks = links.map((l) => {
    return (
      <li className="navbar-item" key={l.link}>
        <Link className="nav-link" to={l.link}>
          {l.text}
        </Link>
      </li>
    );
  });
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
          {navlinks}
          <li className="navbar-item">
            <div
              className="nav-link"
              onClick={() => {
                fetch(URL + "/api/logout").then(() => {
                  history.push("/");
                });
              }}
            >
              Logout
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
