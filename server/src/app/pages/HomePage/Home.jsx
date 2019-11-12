import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/builder">
        <button>Builder</button>
      </Link>
      <Link to="/viewer">
        <button>Viewer</button>
      </Link>
    </div>
  );
}

export default Home;
