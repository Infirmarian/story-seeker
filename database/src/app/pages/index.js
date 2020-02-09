import { Switch, Route } from "react-router-dom";
import React from "react";
import Login from "./Login/Login";
import Home from "./Home/Home";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
    </Switch>
  );
}

export default Routes;
