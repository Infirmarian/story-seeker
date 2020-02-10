import { Switch, Route } from "react-router-dom";
import React from "react";
import Login from "./Login/Login";
import Home from "./Home/Home";
import { Forbidden } from "./Errors/Errors";
import Pending from "./Pending/Pending";
import Preview from "./Preview/Preview";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route exact path="/pending" component={Pending} />
      <Route path="/pending/:storyid" component={Preview} />
      <Route path="/403" component={Forbidden} />
    </Switch>
  );
}

export default Routes;
