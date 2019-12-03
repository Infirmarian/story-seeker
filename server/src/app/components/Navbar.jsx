import React from "react";
import { Link, useHistory } from "react-router-dom";
import { URL } from "../../utils/constants";
import "./Navbar.css";

function Navbar() {
  let history = useHistory();
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link nav-text" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <div
              className="nav-link nav-text"
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
          <li className="nav-item">
            <Link className="nav-link nav-text" to="/viewer/new">
              New Story
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
