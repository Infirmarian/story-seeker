import React from "react";
import { Link } from "react-router-dom";
import "./Page404.css";
function Page404() {
  return (
    <div>
      <h1 style={{ zIndex: -1 }}>Error 404</h1>
      <Link to="/">Home</Link>
    </div>
  );
}
export default Page404;
