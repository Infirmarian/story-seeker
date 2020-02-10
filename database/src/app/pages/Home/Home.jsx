import React from "react";
import { Link } from "react-router-dom";

function Home(props) {
  const accessLevel = sessionStorage.getItem("access");
  console.log(accessLevel);
  return (
    <>
      <h1>Story Seeker Management</h1>
      {accessLevel ? (
        <>
          {accessLevel === "admin" ? (
            <h4>
              <Link to="/story">All Stories</Link>
            </h4>
          ) : null}
          <h4>
            <Link to="/pending">Pending Stories</Link>
          </h4>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </>
  );
}

export default Home;
