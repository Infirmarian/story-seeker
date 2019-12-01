import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {URL} from "../../../utils/constants";
function Home() {

  const [username, setUsername] = useState('')
  useEffect(() => {
    fetch(URL+'/api/get_loggedin_user').then((response) => {
      response.json().then((value) => {
        console.log(value);
        setUsername(value.user);
      }).catch((error) => console.error(error));
  }).catch((error) =>{
      console.error(error);
  });
  }, [])
  return (
    <div>
        <header className="masthead d-flex">
          <div className="container text-center my-auto">
            <h1 className="mb-1">Story Seeker</h1>
            <h3 className="mb-5">
              <em>A Choose Your Own Adventure Style Skill for Alexa</em>
            </h3>
            <a className="btn btn-primary btn-xl" href="https://alexa.amazon.com">Get it on Alexa</a>
            <Link to={username ? "/viewer" : "/login"} className="btn btn-primary btn-xl">Write Stories</Link>
          </div>
          <div className="overlay"></div>
        </header>
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
