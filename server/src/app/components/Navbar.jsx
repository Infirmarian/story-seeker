import React from "react";
import { Link, useHistory } from "react-router-dom";
import { URL } from "../../utils/constants";
import "./Navbar.css";

function Navbar() {
  let history = useHistory();
  return (
    <nav className="navbar navbar-expand-lg">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <Link className="nav-link nav-text" to="/">
              Home
            </Link>
          </li>
          <li class="nav-item">
            <div
              className="nav-link nav-text"
              onClick={() => {
                fetch(URL + "/api/get_all_stories").then(() => {
                  history.push("/");
                });
              }}
            >
              Logout
            </div>
          </li>
          <li class="nav-item">
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
