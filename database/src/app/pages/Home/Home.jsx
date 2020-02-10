import React from "react";
import { Link } from "react-router-dom";

function Home(props) {
  return (
    <>
      <h1>Story Seeker Management</h1>
      <Link to="/login">Login</Link>
    </>
  );
}

export default Home;
