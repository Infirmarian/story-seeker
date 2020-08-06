import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../../components/Firebase";
import Button from "@material-ui/core/Button";
import "./Home.css";
function Home() {
  const [user, setUser] = useState<firebase.User | null>(null);
  Auth().onAuthStateChanged((user) => setUser(user));
  return (
    <header className="masthead d-flex">
      <div className="container text-center my-auto">
        <h1 className="mb-1">Story Seeker</h1>
        <h3 className="mb-5">
          <em>A Choose Your Own Adventure Style Skill for Alexa</em>
        </h3>
        <Button
          style={{ margin: 20 }}
          variant="contained"
          color="primary"
          href="https://www.amazon.com/dp/B0828V3DD9/"
        >
          Get it on Alexa
        </Button>
        <Button
          style={{ margin: 20 }}
          variant="contained"
          color="primary"
          component={Link}
          to={user ? "/story" : "/login"}
        >
          Write Stories
        </Button>
      </div>
      <div className="overlay"></div>
    </header>
  );
}

export default Home;
